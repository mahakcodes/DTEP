from rest_framework import serializers

from .models import Result


class ResultSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source='test.title', read_only=True)

    class Meta:
        model = Result
        fields = (
            'id',
            'attempt',
            'test',
            'test_title',
            'student',
            'score',
            'max_score',
            'percentage',
            'correct_answers',
            'total_questions',
            'calculated_at',
        )
        read_only_fields = fields


class LeaderboardEntrySerializer(serializers.Serializer):
    student_name = serializers.CharField()
    email = serializers.EmailField()
    score = serializers.FloatField()
    max_score = serializers.FloatField()
    percentage = serializers.FloatField()
    rank = serializers.IntegerField()
    percentile = serializers.FloatField()
