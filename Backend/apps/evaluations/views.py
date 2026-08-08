from django.conf import settings
from django.db.models import Count, F, Q
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

# Fixed Imports (Removed 'Backend.' prefix)
from apps.results.models import Result
from apps.tests.models import QuestionType, Test
from apps.users.permissions import IsStudentUserRole, IsTeacherUserRole

from .models import AttemptStatus, Response as ResponseModel, TestAttempt
from .scoring import calculate_attempt_scores
from .serializers import (
    GradeDescriptiveAnswerSerializer,
    LogViolationSerializer,
    PendingEvaluationSerializer,
    ResponseSerializer,
    SaveResponseSerializer,
    StartTestSerializer,
    SubmitTestSerializer,
    TestAttemptSerializer,
)


class StartTestView(APIView):
    permission_classes = (IsAuthenticated, IsStudentUserRole)

    def post(self, request, *args, **kwargs):
        serializer = StartTestSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        attempt = serializer.save()
        return Response(TestAttemptSerializer(attempt).data, status=201)


class SaveResponseView(APIView):
    permission_classes = (IsAuthenticated, IsStudentUserRole)
    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = 'autosave'

    def post(self, request, *args, **kwargs):
        serializer = SaveResponseSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        response = serializer.save()
        return Response(ResponseSerializer(response).data, status=200)


class SubmitTestView(APIView):
    permission_classes = (IsAuthenticated, IsStudentUserRole)

    def post(self, request, *args, **kwargs):
        serializer = SubmitTestSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        attempt = serializer.save()

        scoring = calculate_attempt_scores(attempt)

        result, _created = Result.objects.update_or_create(
            attempt=attempt,
            defaults={
                'student': attempt.student,
                'test': attempt.test,
                'score': scoring['score'],
                'max_score': scoring['max_score'],
                'percentage': scoring['percentage'],
                'correct_answers': scoring['correct_answers'],
                'total_questions': scoring['total_questions'],
            },
        )

        return Response(
            {
                'attempt_id': attempt.id,
                'status': attempt.status,
                'score': result.score,
                'max_score': result.max_score,
                'percentage': result.percentage,
                'correct_answers': result.correct_answers,
                'total_questions': result.total_questions,
                'result_id': result.id,
            },
            status=200,
        )


class PendingEvaluationsListView(APIView):
    permission_classes = (IsAuthenticated, IsTeacherUserRole)

    def get(self, request, *args, **kwargs):
        attempts = (
            TestAttempt.objects.filter(status=AttemptStatus.SUBMITTED)
            .annotate(
                descriptive_count=Count(
                    'test__questions',
                    filter=Q(test__questions__question_type=QuestionType.DESCRIPTIVE),
                    distinct=True,
                ),
                graded_count=Count(
                    'responses',
                    filter=Q(
                        responses__question__question_type=QuestionType.DESCRIPTIVE,
                        responses__awarded_marks__isnull=False,
                    ),
                    distinct=True,
                ),
            )
            .annotate(pending_descriptive_count=F('descriptive_count') - F('graded_count'))
            .filter(descriptive_count__gt=F('graded_count'))
            .select_related('student', 'test')
            .order_by('-submitted_at')
        )

        return Response(PendingEvaluationSerializer(attempts, many=True).data, status=200)


class GradeDescriptiveAnswerView(APIView):
    permission_classes = (IsAuthenticated, IsTeacherUserRole)

    def post(self, request, *args, **kwargs):
        serializer = GradeDescriptiveAnswerSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        attempt = serializer.validated_data['attempt']
        question = serializer.validated_data['question']

        response, _created = ResponseModel.objects.get_or_create(attempt=attempt, question=question)
        response.awarded_marks = serializer.validated_data['awarded_marks']
        response.feedback = serializer.validated_data.get('feedback', '')
        response.graded_by = request.user
        response.graded_at = timezone.now()
        response.save()

        scoring = calculate_attempt_scores(attempt)

        result, _created = Result.objects.update_or_create(
            attempt=attempt,
            defaults={
                'student': attempt.student,
                'test': attempt.test,
                'score': scoring['score'],
                'max_score': scoring['max_score'],
                'percentage': scoring['percentage'],
                'correct_answers': scoring['correct_answers'],
                'total_questions': scoring['total_questions'],
            },
        )

        pending_descriptive_count = (
            attempt.test.questions.filter(question_type=QuestionType.DESCRIPTIVE).count()
            - ResponseModel.objects.filter(
                attempt=attempt,
                question__question_type=QuestionType.DESCRIPTIVE,
                awarded_marks__isnull=False,
            ).count()
        )

        return Response(
            {
                'attempt_id': attempt.id,
                'question_id': question.id,
                'awarded_marks': response.awarded_marks,
                'feedback': response.feedback,
                'result_id': result.id,
                'score': result.score,
                'max_score': result.max_score,
                'percentage': result.percentage,
                'pending_descriptive_count': pending_descriptive_count,
            },
            status=200,
        )


class LogViolationView(APIView):
    permission_classes = (IsAuthenticated, IsStudentUserRole)
    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = 'violation'

    def post(self, request, *args, **kwargs):
        serializer = LogViolationSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        violation = serializer.save()
        attempt = serializer.validated_data['attempt']

        violations_count = attempt.violations.count()
        terminated = False

        if violations_count >= settings.MAX_TEST_VIOLATIONS:
            attempt.status = AttemptStatus.TERMINATED
            attempt.submitted_at = timezone.now()
            attempt.save(update_fields=['status', 'submitted_at'])

            scoring = calculate_attempt_scores(attempt)
            Result.objects.update_or_create(
                attempt=attempt,
                defaults={
                    'student': attempt.student,
                    'test': attempt.test,
                    'score': scoring['score'],
                    'max_score': scoring['max_score'],
                    'percentage': scoring['percentage'],
                    'correct_answers': scoring['correct_answers'],
                    'total_questions': scoring['total_questions'],
                },
            )
            terminated = True

        return Response(
            {
                'attempt_id': attempt.id,
                'violation_id': violation.id,
                'violation_type': violation.violation_type,
                'violations_count': violations_count,
                'terminated': terminated,
                'status': attempt.status,
            },
            status=200,
        )


# Dynamic Test Detail View (Student side ke test load karne ke liye)
class TestDetailView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, test_code, *args, **kwargs):
        query = Q(id=int(test_code)) if str(test_code).isdigit() else Q(code=test_code)
        test = Test.objects.filter(query).first()

        if not test:
            return Response({"error": "Test not found"}, status=404)

        questions_data = []
        if hasattr(test, 'questions'):
            for q in test.questions.all():
                questions_data.append({
                    'id': getattr(q, 'id', None),
                    'text': getattr(q, 'text', getattr(q, 'question_text', '')),
                    'question_type': getattr(q, 'question_type', ''),
                    'marks': getattr(q, 'marks', 1),
                    'options': getattr(q, 'options', []),
                })

        return Response({
            'id': test.id,
            'code': getattr(test, 'code', str(test.id)),
            'title': getattr(test, 'title', getattr(test, 'name', 'Untitled Test')),
            'duration': getattr(test, 'duration', 0),
            'questions': questions_data,
        }, status=200)