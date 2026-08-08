from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('evaluations', '0002_response_awarded_marks_response_feedback_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='testattempt',
            name='client_session_id',
            field=models.CharField(blank=True, default='', max_length=64),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='testattempt',
            name='status',
            field=models.CharField(
                choices=[
                    ('IN_PROGRESS', 'In Progress'),
                    ('STARTED', 'Started'),
                    ('SUBMITTED', 'Submitted'),
                    ('TERMINATED', 'Terminated'),
                ],
                default='IN_PROGRESS',
                max_length=20,
            ),
        ),
        migrations.CreateModel(
            name='TestViolation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('violation_type', models.CharField(choices=[('TAB_SWITCH', 'Tab Switch'), ('FULLSCREEN_EXIT', 'Fullscreen Exit'), ('COPY_PASTE', 'Copy/Paste')], max_length=30)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('metadata', models.JSONField(blank=True, default=dict)),
                ('attempt', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='violations', to='evaluations.testattempt')),
            ],
        ),
        migrations.AddIndex(
            model_name='testviolation',
            index=models.Index(fields=['attempt', 'violation_type', 'timestamp'], name='evaluations_attempt_abe385_idx'),
        ),
    ]
