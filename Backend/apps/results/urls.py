from django.urls import path
from .views import (
    ExportTestResultsCSVView,
    ResultDetailView,
    TestAnalyticsView,
    TestLeaderboardView,
)

urlpatterns = [
    path('attempts/<int:attempt_id>/', ResultDetailView.as_view(), name='result-detail'),
    path('tests/<int:test_id>/analytics/', TestAnalyticsView.as_view(), name='test-analytics'),
    path('tests/<int:test_id>/export/csv/', ExportTestResultsCSVView.as_view(), name='export-test-results'),
    path('tests/<int:test_id>/leaderboard/', TestLeaderboardView.as_view(), name='test-leaderboard'),
]
