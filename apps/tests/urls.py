from django.urls import path

from .views import StudentTestDetailView, TestDetailView, TestListCreateView

urlpatterns = [
    path('', TestListCreateView.as_view(), name='tests-list-create'),
    path('<int:pk>/', TestDetailView.as_view(), name='tests-detail'),
    path('<int:pk>/student/', StudentTestDetailView.as_view(), name='tests-student-detail'),
]
