from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.exceptions import NotFound

# Imports fixed (Removed 'Backend.' prefix)
from apps.users.permissions import IsStudentUserRole
from apps.users.models import TeacherStudentMapping

from .models import Test
from .serializers import StudentTestSerializer, TestSerializer


class IsTeacherOrAdminRole(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ('TEACHER', 'ADMIN')
        )


class TestListCreateView(ListCreateAPIView):
    queryset = Test.objects.all().order_by('-created_at')
    serializer_class = TestSerializer
    permission_classes = (IsAuthenticated, IsTeacherOrAdminRole)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class TestDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = (IsAuthenticated, IsTeacherOrAdminRole)


# 1. Student ke liye Mapped Teacher ke Tests fetch karne ka View
class StudentTestListView(ListAPIView):
    serializer_class = StudentTestSerializer
    permission_classes = (IsAuthenticated, IsStudentUserRole)

    def get_queryset(self):
        student = self.request.user
        
        # Student ke mapped teacher ko dhoondhein
        mapping = TeacherStudentMapping.objects.filter(student=student).first()
        if not mapping:
            return Test.objects.none()

        # Teacher ke banaye saare tests return karein
        return Test.objects.filter(created_by=mapping.teacher).order_by('-created_at')


# 2. Dynamic Student Test Detail View (Direct ID / Code Lookup)
class StudentTestDetailView(RetrieveAPIView):
    queryset = Test.objects.all()
    serializer_class = StudentTestSerializer
    permission_classes = (IsAuthenticated, IsStudentUserRole)

    def get_object(self):
        # Direct URL Kwarg (pk ya test_code) se dynamic fetch
        test_id = self.kwargs.get('pk') or self.kwargs.get('test_code')
        
        try:
            # First attempt: Primary Key (ID) se search
            if str(test_id).isdigit():
                return Test.objects.get(id=test_id)
            
            # Second attempt: Code field se search (agar model me code field ho)
            return Test.objects.get(code=test_id)
        except (Test.DoesNotExist, ValueError):
            raise NotFound(detail="Requested Test was not found in the database.")