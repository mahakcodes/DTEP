from django.db import migrations, models
import django.db.models.deletion


def migrate_evaluator_to_teacher(apps, schema_editor):
    User = apps.get_model('users', 'User')
    User.objects.filter(role='EVALUATOR').update(role='TEACHER')


def reverse_migrate_teacher_to_evaluator(apps, schema_editor):
    User = apps.get_model('users', 'User')
    User.objects.filter(role='TEACHER').update(role='EVALUATOR')


class Migration(migrations.Migration):
    dependencies = [
        ('users', '0002_alter_user_managers'),
    ]

    operations = [
        migrations.RunPython(migrate_evaluator_to_teacher, reverse_migrate_teacher_to_evaluator),
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(
                choices=[('ADMIN', 'Admin'), ('TEACHER', 'Teacher'), ('STUDENT', 'Student')],
                default='STUDENT',
                max_length=20,
            ),
        ),
        migrations.CreateModel(
            name='TeacherStudentMapping',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                (
                    'student',
                    models.ForeignKey(
                        limit_choices_to={'role': 'STUDENT'},
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='assigned_teachers',
                        to='users.user',
                    ),
                ),
                (
                    'teacher',
                    models.ForeignKey(
                        limit_choices_to={'role': 'TEACHER'},
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='assigned_students',
                        to='users.user',
                    ),
                ),
            ],
            options={
                'unique_together': {('teacher', 'student')},
            },
        ),
        migrations.AddIndex(
            model_name='teacherstudentmapping',
            index=models.Index(fields=['teacher', 'student'], name='users_teache_teacher__0f6538_idx'),
        ),
    ]

