from rest_framework import serializers

from .models import Option, Question, Test


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ('id', 'text', 'is_correct', 'order')


class StudentOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ('id', 'text', 'order')


class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ('id', 'text', 'question_type', 'marks', 'order', 'options')


class StudentQuestionSerializer(serializers.ModelSerializer):
    options = StudentOptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ('id', 'text', 'question_type', 'marks', 'order', 'options')


class TestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Test
        fields = ('id', 'title', 'description', 'duration_minutes', 'created_by', 'created_at', 'questions')
        read_only_fields = ('id', 'created_by', 'created_at')

    def create(self, validated_data):
        questions_data = validated_data.pop('questions', [])
        request = self.context.get('request')
        test = Test.objects.create(created_by=request.user, **validated_data)

        for question_data in questions_data:
            options_data = question_data.pop('options', [])
            question = Question.objects.create(test=test, **question_data)
            for option_data in options_data:
                Option.objects.create(question=question, **option_data)

        return test


class StudentTestSerializer(serializers.ModelSerializer):
    questions = StudentQuestionSerializer(many=True)

    class Meta:
        model = Test
        fields = ('id', 'title', 'description', 'duration_minutes', 'created_at', 'questions')
