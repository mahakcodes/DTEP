from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    AdminCreateStudentView,
    AdminCreateTeacherView,
    CustomLoginView,
    UserProfileView,
    AdminTeacherMappingListView,
    AdminUnassignedStudentsView,
    AdminAssignStudentsToTeacherView,
    TeacherMyStudentsView,
    StudentMyTeacherView,
)

urlpatterns = [
    # Auth & Profile Endpoints
    path('login/', CustomLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    
    # User Creation Endpoints
    path('teachers/create/', AdminCreateTeacherView.as_view(), name='create-teacher'),
    path('students/create/', AdminCreateStudentView.as_view(), name='create-student'),

    # Duplicate / Auth Aliases
    path('auth/login/', CustomLoginView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/create-teacher/', AdminCreateTeacherView.as_view(), name='admin_create_teacher'),
    path('admin/create-student/', AdminCreateStudentView.as_view(), name='admin_create_student'),

    # ==========================================
    # Teacher-Student Mapping Endpoints (Admin)
    # ==========================================
    path('admin/teacher-mappings/', AdminTeacherMappingListView.as_view(), name='admin-teacher-mappings'),
    path('admin/unassigned-students/', AdminUnassignedStudentsView.as_view(), name='admin-unassigned-students'),
    path('admin/assign-students/', AdminAssignStudentsToTeacherView.as_view(), name='admin-assign-students'),

    # ==========================================
    # Dashboard Endpoints (Teacher & Student)
    # ==========================================
    path('teacher/my-students/', TeacherMyStudentsView.as_view(), name='teacher-my-students'),
    path('student/my-teacher/', StudentMyTeacherView.as_view(), name='student-my-teacher'),
]