# -*- coding: utf-8 -*-
# Generated by Django 1.9.3 on 2017-11-13 17:41
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_enumfield.enum
import launcher.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('launcher', '0004_auto_20171101_0255'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectApplication',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('APR', django_enumfield.enum.Value('APPROVED', 'APR', 'Invited for the practice', launcher.models.ProjectStatusEnum)), ('INV', django_enumfield.enum.Value('INVITED', 'INV', 'Invited for the interview', launcher.models.ProjectStatusEnum)), ('REC', django_enumfield.enum.Value('RECOMMENDED', 'REC', 'Recommended', launcher.models.ProjectStatusEnum)), ('REJ', django_enumfield.enum.Value('REJECTED', 'REJ', 'Rejected', launcher.models.ProjectStatusEnum)), ('SUB', django_enumfield.enum.Value('SUBMITTED', 'SUB', 'Submitted', launcher.models.ProjectStatusEnum))], default='SUB', max_length=3, verbose_name='Status')),
                ('candidate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='internship', to='launcher.Project')),
            ],
            options={
                'verbose_name': 'Project application',
                'verbose_name_plural': 'Project applications',
            },
        ),
    ]
