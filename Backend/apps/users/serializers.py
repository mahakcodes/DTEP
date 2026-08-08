from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import TeacherProfile, StudentProfile, TeacherStudentMapping, UserRole

User = get_user_model()

# ==========================================
# 1. CUSTOM LOGIN SERIALIZER (Email Based)
# ==========================================
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'username' in self.fields:
            del self.fields['username']

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"detail": "No account found with this email."})

        if not user.check_password(password):
            raise serializers.ValidationError({"detail": "Incorrect password."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "This account is inactive."})

        refresh = self.get_token(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'role': getattr(user, 'role', 'STUDENT')
            }
        }


# ==========================================
# 2. ADMIN CREATE TEACHER SERIALIZER
# ==========================================
class AdminCreateTeacherSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    employee_id = serializers.CharField(write_only=True, required=False)
    department = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'employee_id', 'department']

    def create(self, validated_data):
        employee_id = validated_data.pop('employee_id', 'T-DEFAULT')
        department = validated_data.pop('department', 'General')
        
        user = User.objects.create_user(
            username=validated_data.get('username', validated_data['email'].split('@')[0]),
            email=validated_data['email'],
            password=validated_data['password'],
            role=UserRole.TEACHER
        )
        TeacherProfile.objects.create(user=user, employee_id=employee_id, department=department)
        return user


# ==========================================
# 3. ADMIN CREATE STUDENT SERIALIZER
# ==========================================
class AdminCreateStudentSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    roll_number = serializers.CharField(write_only=True, required=False)
    branch = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'roll_number', 'branch']

    def create(self, validated_data):
        roll_number = validated_data.pop('roll_number', 'S-DEFAULT')
        branch = validated_data.pop('branch', 'General')
        
        user = User.objects.create_user(
            username=validated_data.get('username', validated_data['email'].split('@')[0]),
            email=validated_data['email'],
            password=validated_data['password'],
            role=UserRole.STUDENT
        )
        StudentProfile.objects.create(user=user, roll_number=roll_number, branch=branch)
        return user


# ==========================================
# 4. MAPPING & DASHBOARD SERIALIZERS
# ==========================================
class StudentMappingDetailSerializer(serializers.ModelSerializer):
    roll_number = serializers.SerializerMethodField()
    branch = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'roll_number', 'branch']

    def get_roll_number(self, obj):
        profile = getattr(obj, 'student_profile', None)
        return profile.roll_number if profile else None

    def get_branch(self, obj):
        profile = getattr(obj, 'student_profile', None)
        return profile.branch if profile else None


class TeacherMappingDetailSerializer(serializers.ModelSerializer):
    employee_id = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    assigned_students = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'employee_id', 'department', 'assigned_students']

    def get_employee_id(self, obj):
        profile = getattr(obj, 'teacher_profile', None)
        return profile.employee_id if profile else None

    def get_department(self, obj):
        profile = getattr(obj, 'teacher_profile', None)
        return profile.department if profile else None

    def get_assigned_students(self, obj):
        mappings = TeacherStudentMapping.objects.filter(teacher=obj).select_related('student__student_profile')
        students = [m.student for m in mappings]
        return StudentMappingDetailSerializer(students, many=True).data


class AssignStudentsSerializer(serializers.Serializer):
    teacher_id = serializers.IntegerField(required=True)
    student_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=True,
        help_text="List of Student User IDs"
    )


class TeacherMyStudentSerializer(serializers.ModelSerializer):
    roll_number = serializers.SerializerMethodField()
    branch = serializers.SerializerMethodField()
    course = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'roll_number', 'branch', 'course']

    def get_roll_number(self, obj):
        profile = getattr(obj, 'student_profile', None)
        return profile.roll_number if profile else None

    def get_branch(self, obj):
        profile = getattr(obj, 'student_profile', None)
        return profile.branch if profile else None

    def get_course(self, obj):
        profile = getattr(obj, 'student_profile', None)
        return profile.course if profile else None


class StudentMyTeacherSerializer(serializers.ModelSerializer):
    employee_id = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'employee_id', 'department']

    def get_employee_id(self, obj):
        profile = getattr(obj, 'teacher_profile', None)
        return profile.employee_id if profile else None

    def get_department(self, obj):
        profile = getattr(obj, 'teacher_profile', None)
        return profile.department if profile else None