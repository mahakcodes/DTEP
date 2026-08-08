from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import TeacherMyStudentSerializer, StudentMyTeacherSerializer
from .models import UserRole, TeacherStudentMapping
from .serializers import (
    CustomTokenObtainPairSerializer,
    AdminCreateTeacherSerializer,
    AdminCreateStudentSerializer,
    TeacherMappingDetailSerializer,
    StudentMappingDetailSerializer,
    AssignStudentsSerializer
)

User = get_user_model()

# ==========================================
# 1. CUSTOM LOGIN VIEW
# ==========================================
class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# ==========================================
# 2. CREATE TEACHER VIEW
# ==========================================
class AdminCreateTeacherView(generics.CreateAPIView):
    serializer_class = AdminCreateTeacherSerializer
    # Abhi testing ke liye permission open rakhi hai
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "message": "Teacher account created successfully!",
            "email": user.email
        }, status=status.HTTP_201_CREATED)

# ==========================================
# 3. CREATE STUDENT VIEW
# ==========================================
class AdminCreateStudentView(generics.CreateAPIView):
    serializer_class = AdminCreateStudentSerializer
    # Abhi testing ke liye permission open rakhi hai
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "message": "Student account created successfully!",
            "email": user.email
        }, status=status.HTTP_201_CREATED)

# ==========================================
# 4. USER PROFILE VIEW
# ==========================================
class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": getattr(user, 'role', 'STUDENT')
        })

# ==========================================
# 5. ADMIN TEACHER-STUDENT MAPPING VIEWS
# ==========================================

# 5.1 List All Teachers along with their Mapped Students
class AdminTeacherMappingListView(APIView):
    permission_classes = [permissions.AllowAny]  # Testing ke liye AllowAny, baad me IsAuthenticated kar sakte hain

    def get(self, request):
        teachers = User.objects.filter(role=UserRole.TEACHER).select_related('teacher_profile')
        serializer = TeacherMappingDetailSerializer(teachers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# 5.2 Get All Students Unassigned to Any Teacher
class AdminUnassignedStudentsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        assigned_student_ids = TeacherStudentMapping.objects.values_list('student_id', flat=True)
        unassigned_students = User.objects.filter(role=UserRole.STUDENT).exclude(id__in=assigned_student_ids).select_related('student_profile')
        serializer = StudentMappingDetailSerializer(unassigned_students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# 5.3 Assign/Update Mapped Students for a Specific Teacher
class AdminAssignStudentsToTeacherView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AssignStudentsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        teacher_id = serializer.validated_data['teacher_id']
        student_ids = serializer.validated_data['student_ids']

        # Check Teacher Existence
        try:
            teacher = User.objects.get(id=teacher_id, role=UserRole.TEACHER)
        except User.DoesNotExist:
            return Response({"detail": "Teacher not found or specified user is not a teacher."}, status=status.HTTP_404_NOT_FOUND)

        # Get Valid Students
        valid_students = User.objects.filter(id__in=student_ids, role=UserRole.STUDENT)

        # Clear existing mappings for this teacher & re-assign
        TeacherStudentMapping.objects.filter(teacher=teacher).delete()

        new_mappings = [
            TeacherStudentMapping(teacher=teacher, student=student)
            for student in valid_students
        ]
        TeacherStudentMapping.objects.bulk_create(new_mappings)

        return Response({
            "message": f"Successfully mapped {len(new_mappings)} students to Teacher '{teacher.username}'.",
            "teacher_id": teacher.id,
            "total_assigned": len(new_mappings)
        }, status=status.HTTP_200_OK)

    

# 2nd: Teacher Dashboard API -> Logged-in teacher ke mapped students list
class TeacherMyStudentsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if getattr(request.user, 'role', None) != UserRole.TEACHER:
            return Response({"detail": "Only teachers can access this endpoint."}, status=status.HTTP_403_FORBIDDEN)

        mappings = TeacherStudentMapping.objects.filter(teacher=request.user).select_related('student__student_profile')
        students = [m.student for m in mappings]
        serializer = TeacherMyStudentSerializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# 3rd: Student Dashboard API -> Logged-in student ka assigned teacher detail
class StudentMyTeacherView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if getattr(request.user, 'role', None) != UserRole.STUDENT:
            return Response({"detail": "Only students can access this endpoint."}, status=status.HTTP_403_FORBIDDEN)

        mapping = TeacherStudentMapping.objects.filter(student=request.user).select_related('teacher__teacher_profile').first()
        if not mapping:
            return Response({"detail": "No teacher assigned yet."}, status=status.HTTP_444_NOT_FOUND if False else status.HTTP_200_OK)

        serializer = StudentMyTeacherSerializer(mapping.teacher)
        return Response(serializer.data, status=status.HTTP_200_OK)