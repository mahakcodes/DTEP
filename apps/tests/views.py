from rest_framework.generics import ListCreateAPIView, RetrieveAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import BasePermission, IsAuthenticated

from apps.users.permissions import IsStudentUserRole

from .models import Test
from .serializers import StudentTestSerializer, TestSerializer


class IsEvaluatorOrAdminRole(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ('EVALUATOR', 'ADMIN')
        )


class TestListCreateView(ListCreateAPIView):
    queryset = Test.objects.all().order_by('-created_at')
    serializer_class = TestSerializer
    permission_classes = (IsAuthenticated, IsEvaluatorOrAdminRole)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class TestDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = (IsAuthenticated, IsEvaluatorOrAdminRole)


class StudentTestDetailView(RetrieveAPIView):
    queryset = Test.objects.all()
    serializer_class = StudentTestSerializer
    permission_classes = (IsAuthenticated, IsStudentUserRole)
