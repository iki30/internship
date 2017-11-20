from django.contrib import admin

from .models import StudentApplication, FreeMeetingTime, AppointmentSlot, Project

admin.site.register(Project)
admin.site.register(StudentApplication)
admin.site.register(FreeMeetingTime)
admin.site.register(AppointmentSlot)