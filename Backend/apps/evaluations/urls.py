from django.urls import path

from .views import (
    GradeDescriptiveAnswerView,
    LogViolationView,
    PendingEvaluationsListView,
    SaveResponseView,
    StartTestView,
    SubmitTestView,
    TestDetailView,
)

urlpatterns = [
    path('start/', StartTestView.as_view(), name='evaluations-start'),
    path('save-response/', SaveResponseView.as_view(), name='evaluations-save-response'),
    path('submit/', SubmitTestView.as_view(), name='evaluations-submit'),
    path('pending/', PendingEvaluationsListView.as_view(), name='evaluations-pending'),
    path('grade/', GradeDescriptiveAnswerView.as_view(), name='evaluations-grade'),
    path('violations/log/', LogViolationView.as_view(), name='evaluations-log-violation'),
    
    # ⚠️ Yeh route sabhi static routes ke niche honi chahiye:
    path('<str:test_code>/', TestDetailView.as_view(), name='test-detail'),
]