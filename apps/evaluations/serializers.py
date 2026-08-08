from django.utils import timezone
from rest_framework import serializers

from apps.tests.models import Option, Question, QuestionType, Test

from .models import AttemptStatus, Response, TestAttempt, TestViolation, ViolationType


class TestAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestAttempt
        fields = ('id', 'test', 'student', 'status', 'started_at', 'submitted_at')
        read_only_fields = ('id', 'student', 'status', 'started_at', 'submitted_at')


class StartTestSerializer(serializers.Serializer):
    test_id = serializers.IntegerField()
    client_session_id = serializers.CharField(required=False, allow_blank=True, max_length=64)

    def validate_test_id(self, value):
        if not Test.objects.filter(id=value).exists():
            raise serializers.ValidationError('Invalid test_id.')
        return value

    def create(self, validated_data):
        student = self.context['request'].user
        test = Test.objects.get(id=validated_data['test_id'])
        client_session_id = (validated_data.get('client_session_id') or '').strip()

        attempt = TestAttempt.objects.filter(
            student=student,
            test=test,
            status__in=(AttemptStatus.IN_PROGRESS, AttemptStatus.STARTED),
        ).order_by('-started_at').first()

        if attempt:
            if client_session_id and attempt.client_session_id and attempt.client_session_id != client_session_id:
                raise serializers.ValidationError(
                    {'client_session_id': 'Another active session already exists for this test.'}
                )
            if client_session_id and not attempt.client_session_id:
                attempt.client_session_id = client_session_id
                attempt.save(update_fields=['client_session_id'])
            return attempt

        return TestAttempt.objects.create(
            student=student,
            test=test,
            status=AttemptStatus.IN_PROGRESS,
            client_session_id=client_session_id,
        )


class SaveResponseSerializer(serializers.Serializer):
    attempt_id = serializers.IntegerField()
    question_id = serializers.IntegerField()
    selected_option_id = serializers.IntegerField(required=False, allow_null=True)
    descriptive_text = serializers.CharField(required=False, allow_blank=True)
    client_session_id = serializers.CharField(required=False, allow_blank=True, max_length=64)

    def validate(self, attrs):
        student = self.context['request'].user
        attempt = TestAttempt.objects.filter(id=attrs['attempt_id'], student=student).first()
        if not attempt:
            raise serializers.ValidationError('Invalid attempt_id.')
        if attempt.status not in (AttemptStatus.IN_PROGRESS, AttemptStatus.STARTED):
            raise serializers.ValidationError('Attempt is not active.')
        client_session_id = (attrs.get('client_session_id') or '').strip()
        if client_session_id and attempt.client_session_id and attempt.client_session_id != client_session_id:
            raise serializers.ValidationError({'client_session_id': 'Active session mismatch.'})

        question = Question.objects.filter(id=attrs['question_id'], test=attempt.test).first()
        if not question:
            raise serializers.ValidationError('Invalid question_id for this attempt.')

        selected_option_id = attrs.get('selected_option_id', None)
        descriptive_text = attrs.get('descriptive_text', '')

        if question.question_type == QuestionType.MCQ:
            if selected_option_id is None:
                raise serializers.ValidationError('selected_option_id is required for MCQ.')
            option = Option.objects.filter(id=selected_option_id, question=question).first()
            if not option:
                raise serializers.ValidationError('Invalid selected_option_id for this question.')
        else:
            if 'descriptive_text' not in attrs:
                raise serializers.ValidationError('descriptive_text is required for descriptive questions.')

        attrs['attempt'] = attempt
        attrs['question'] = question
        return attrs

    def create(self, validated_data):
        attempt = validated_data['attempt']
        question = validated_data['question']

        response, _created = Response.objects.get_or_create(attempt=attempt, question=question)

        if question.question_type == QuestionType.MCQ:
            response.selected_option_id = validated_data.get('selected_option_id')
            response.descriptive_text = ''
        else:
            response.descriptive_text = validated_data.get('descriptive_text', '')
            response.selected_option = None

        response.save()
        return response


class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = ('id', 'attempt', 'question', 'selected_option', 'descriptive_text', 'saved_at')
        read_only_fields = ('id', 'saved_at')


class SubmitTestSerializer(serializers.Serializer):
    attempt_id = serializers.IntegerField()

    def validate_attempt_id(self, value):
        student = self.context['request'].user
        attempt = TestAttempt.objects.filter(id=value, student=student).first()
        if not attempt:
            raise serializers.ValidationError('Invalid attempt_id.')
        if attempt.status in (AttemptStatus.SUBMITTED, AttemptStatus.TERMINATED):
            raise serializers.ValidationError('Attempt already submitted.')
        self.context['attempt'] = attempt
        return value

    def create(self, validated_data):
        attempt = self.context['attempt']
        attempt.status = AttemptStatus.SUBMITTED
        attempt.submitted_at = timezone.now()
        attempt.save(update_fields=['status', 'submitted_at'])
        return attempt


class PendingEvaluationSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source='test.title', read_only=True)
    student_username = serializers.CharField(source='student.username', read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)
    pending_descriptive_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = TestAttempt
        fields = (
            'id',
            'test',
            'test_title',
            'student',
            'student_username',
            'student_email',
            'submitted_at',
            'pending_descriptive_count',
        )


class GradeDescriptiveAnswerSerializer(serializers.Serializer):
    attempt_id = serializers.IntegerField()
    question_id = serializers.IntegerField()
    awarded_marks = serializers.FloatField()
    feedback = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        attempt = TestAttempt.objects.filter(id=attrs['attempt_id']).select_related('test').first()
        if not attempt:
            raise serializers.ValidationError('Invalid attempt_id.')
        if attempt.status != AttemptStatus.SUBMITTED:
            raise serializers.ValidationError('Attempt is not submitted.')

        question = Question.objects.filter(id=attrs['question_id'], test=attempt.test).first()
        if not question:
            raise serializers.ValidationError('Invalid question_id for this attempt.')
        if question.question_type != QuestionType.DESCRIPTIVE:
            raise serializers.ValidationError('Only descriptive questions can be graded manually.')

        awarded_marks = attrs['awarded_marks']
        if awarded_marks < 0:
            raise serializers.ValidationError('awarded_marks must be non-negative.')
        if awarded_marks > question.marks:
            raise serializers.ValidationError('awarded_marks cannot exceed question marks.')

        attrs['attempt'] = attempt
        attrs['question'] = question
        return attrs


class LogViolationSerializer(serializers.Serializer):
    attempt_id = serializers.IntegerField()
    violation_type = serializers.ChoiceField(choices=ViolationType.choices)
    metadata = serializers.JSONField(required=False)
    client_session_id = serializers.CharField(required=False, allow_blank=True, max_length=64)

    def validate(self, attrs):
        student = self.context['request'].user
        attempt = TestAttempt.objects.filter(id=attrs['attempt_id'], student=student).select_related('test').first()
        if not attempt:
            raise serializers.ValidationError('Invalid attempt_id.')
        if attempt.status not in (AttemptStatus.IN_PROGRESS, AttemptStatus.STARTED):
            raise serializers.ValidationError('Attempt is not active.')

        client_session_id = (attrs.get('client_session_id') or '').strip()
        if client_session_id and attempt.client_session_id and attempt.client_session_id != client_session_id:
            raise serializers.ValidationError({'client_session_id': 'Active session mismatch.'})

        attrs['attempt'] = attempt
        return attrs

    def create(self, validated_data):
        attempt = validated_data['attempt']
        return TestViolation.objects.create(
            attempt=attempt,
            violation_type=validated_data['violation_type'],
            metadata=validated_data.get('metadata') or {},
        )
