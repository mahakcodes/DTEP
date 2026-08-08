import os
import django

# Django environment set up
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User, TeacherProfile, StudentProfile, UserRole

def run_seed():
    print("🌱 Starting user seeding process...")

    # 1. Admin Create Karein
    admin_username = "admin"
    admin_email = "admin@testora.com"
    
    admin_user = User.objects.filter(username=admin_username).first() or User.objects.filter(email=admin_email).first()
    
    if not admin_user:
        admin = User.objects.create_superuser(
            username=admin_username,
            email=admin_email,
            password="Admin@123",
            role=UserRole.ADMIN
        )
        print(f"✅ Admin Created: {admin.email} / Password: Admin@123")
    else:
        # User exist karta hai toh role admin ensure kar lo
        admin_user.role = UserRole.ADMIN
        admin_user.save()
        print(f"ℹ️ Admin user '{admin_user.username}' already exists (Role updated).")

    # 2. Teacher Create Karein
    teacher_username = "teacher1"
    teacher_email = "teacher@testora.com"
    
    teacher_user = User.objects.filter(username=teacher_username).first() or User.objects.filter(email=teacher_email).first()
    
    if not teacher_user:
        teacher_user = User.objects.create_user(
            username=teacher_username,
            email=teacher_email,
            password="Teacher@123",
            role=UserRole.TEACHER,
            first_name="John",
            last_name="Doe"
        )
        TeacherProfile.objects.get_or_create(
            user=teacher_user,
            defaults={
                "employee_id": "T1001",
                "department": "Computer Science"
            }
        )
        print(f"✅ Teacher Created: {teacher_user.email} / Password: Teacher@123")
    else:
        print(f"ℹ️ Teacher user '{teacher_user.username}' already exists.")

    # 3. Student Create Karein
    student_username = "student1"
    student_email = "student@testora.com"
    
    student_user = User.objects.filter(username=student_username).first() or User.objects.filter(email=student_email).first()
    
    if not student_user:
        student_user = User.objects.create_user(
            username=student_username,
            email=student_email,
            password="Student@123",
            role=UserRole.STUDENT,
            first_name="Jane",
            last_name="Smith"
        )
        StudentProfile.objects.get_or_create(
            user=student_user,
            defaults={
                "roll_number": "ST202401",
                "branch": "CSE",
                "course": "B.Tech",
                "year": 1,
                "semester": 1
            }
        )
        print(f"✅ Student Created: {student_user.email} / Password: Student@123")
    else:
        print(f"ℹ️ Student user '{student_user.username}' already exists.")

    print("\n🎉 Seeding completed successfully!")

if __name__ == '__main__':
    run_seed()