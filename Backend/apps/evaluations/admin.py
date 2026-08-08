from django.contrib import admin
from .models import TestAttempt, TestViolation

@admin.register(TestAttempt)
class TestAttemptAdmin(admin.ModelAdmin):
    # 'score' field hata diya hai taaki crash na ho
    list_display = ('id', 'student', 'test', 'status', 'started_at')
    list_filter = ('status',)

@admin.register(TestViolation)
class TestViolationAdmin(admin.ModelAdmin):
    list_display = ('id', 'attempt', 'violation_type', 'timestamp')
    list_filter = ('violation_type',)