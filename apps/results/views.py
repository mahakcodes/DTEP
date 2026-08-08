from django.shortcuts import get_object_or_404
from django.db.models import Avg, Max, Min
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from apps.tests.models import Test
from apps.users.permissions import IsEvaluatorUserRole, IsStudentUserRole

from .models import Result
from .serializers import ResultSerializer


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
    permission_classes = (IsAuthenticated, IsEvaluatorUserRole)

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
