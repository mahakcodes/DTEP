from django.urls import path
from .views import (
    TestListCreateView,
    TestDetailView,
    StudentTestListView,
    StudentTestDetailView,
)

urlpatterns = [
    # Teacher / Admin Routes
    path('', TestListCreateView.as_view(), name='test-list-create'),
    path('<int:pk>/', TestDetailView.as_view(), name='test-detail'),
    
    # Student Routes
    path('student/', StudentTestListView.as_view(), name='student-test-list'),
    path('student/<int:pk>/', StudentTestDetailView.as_view(), name='student-test-detail'),
]