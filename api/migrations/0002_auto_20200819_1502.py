# Generated by Django 3.1 on 2020-08-19 09:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='is_completed',
            new_name='isCompleted',
        ),
    ]
