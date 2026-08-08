import csv
from collections import Counter
from datetime import timedelta

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count, Max, Min
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from apps.tests.models import Test
from apps.users.permissions import IsAdminUserRole, IsStudentUserRole, IsTeacherUserRole

from .models import Result
from .serializers import LeaderboardEntrySerializer, ResultSerializer


class IsTeacherOrAdminRole(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ('TEACHER', 'ADMIN')
        )


class ResultDetailView(RetrieveAPIView):
    serializer_class = ResultSerializer
    permission_classes = (IsAuthenticated, IsStudentUserRole)

    def get_object(self):
        attempt_id = self.kwargs['attempt_id']
        return get_object_or_404(
            Result.objects.select_related('test', 'attempt'),
            attempt_id=attempt_id,
            student=self.request.user,
        )


class TestAnalyticsView(APIView):
    permission_classes = (IsAuthenticated, IsTeacherUserRole)

    def get(self, request, test_id, *args, **kwargs):
        get_object_or_404(Test, id=test_id)
        qs = Result.objects.filter(test_id=test_id)
        stats = qs.aggregate(avg_score=Avg('score'), max_score=Max('score'), min_score=Min('score'))

        return Response(
            {
                'test_id': test_id,
                'total_submissions': qs.count(),
                'average_score': stats['avg_score'] or 0,
                'highest_score': stats['max_score'] or 0,
                'lowest_score': stats['min_score'] or 0,
            },
            status=200,
        )


class ExportTestResultsCSVView(APIView):
    permission_classes = (IsAuthenticated, IsTeacherOrAdminRole)

    def get(self, request, test_id, *args, **kwargs):
        test = get_object_or_404(Test, id=test_id)
        qs = (
            Result.objects.filter(test=test)
            .select_related('student', 'attempt')
            .annotate(violations_count=Count('attempt__violations', distinct=True))
            .order_by('-percentage', '-score', 'student__id')
        )

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="test_{test_id}_results.csv"'

        writer = csv.writer(response)
        writer.writerow(
            [
                'Student Name',
                'Email',
                'Score',
                'Total Marks',
                'Percentage',
                'Violations Count',
                'Time Taken',
                'Submitted At',
            ]
        )

        for result in qs:
            student = result.student
            student_name = (student.get_full_name() or student.username or '').strip()
            submitted_at = result.attempt.submitted_at
            time_taken = ''
            if submitted_at:
                duration = submitted_at - result.attempt.started_at
                seconds = max(int(duration.total_seconds()), 0)
                time_taken = str(timedelta(seconds=seconds))

            writer.writerow(
                [
                    student_name,
                    student.email,
                    result.score,
                    result.max_score,
                    result.percentage,
                    result.violations_count,
                    time_taken,
                    submitted_at.isoformat() if submitted_at else '',
                ]
            )

        return response


class TestLeaderboardView(APIView):
    permission_classes = (IsAuthenticated, IsTeacherOrAdminRole)

    def get(self, request, test_id, *args, **kwargs):
        get_object_or_404(Test, id=test_id)
        try:
            limit = int(request.query_params.get('limit', 10))
        except (TypeError, ValueError):
            limit = 10
        limit = max(1, min(limit, 100))

        results = list(
            Result.objects.filter(test_id=test_id)
            .select_related('student')
            .order_by('-percentage', '-score', 'student__id')
        )
        total = len(results)
        if total == 0:
            return Response({'test_id': test_id, 'total_submissions': 0, 'leaders': []}, status=200)

        counts = Counter([r.percentage for r in results])
        below_map = {}
        running = 0
        for value in sorted(counts.keys()):
            below_map[value] = running
            running += counts[value]

        leaders = []
        dense_rank = 0
        prev_percentage = None
        for r in results[:limit]:
            if prev_percentage is None or r.percentage != prev_percentage:
                dense_rank += 1
                prev_percentage = r.percentage

            below = below_map[r.percentage]
            equal = counts[r.percentage]
            percentile = round(100.0 * (below + 0.5 * equal) / total, 2)

            student = r.student
            student_name = (student.get_full_name() or student.username or '').strip()
            leaders.append(
                {
                    'student_name': student_name,
                    'email': student.email,
                    'score': r.score,
                    'max_score': r.max_score,
                    'percentage': r.percentage,
                    'rank': dense_rank,
                    'percentile': percentile,
                }
            )

        return Response(
            {
                'test_id': test_id,
                'total_submissions': total,
                'leaders': LeaderboardEntrySerializer(leaders, many=True).data,
            },
            status=200,
        )
