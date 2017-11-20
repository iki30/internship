from django.contrib.auth.models import User
from django.db import models
from django_enumfield import enum


class Project(models.Model):
    title = models.CharField(max_length=127)
    description = models.CharField(max_length=127)
    mentor = models.ForeignKey(User)
    state = models.CharField(max_length=31)

    def __str__(self):
        return self.title


class AppointmentSlot(models.Model):
    user = models.ForeignKey(User, related_name='appointment_slots')
    student = models.ForeignKey(User, related_name='interviews', null=True, blank=True)

    start = models.DateTimeField()
    end = models.DateTimeField()
    is_synchronize = models.BooleanField()

    def __str__(self):
        return self.user.username


class StudentApplication(models.Model):
    student = models.ForeignKey(User, related_name='intern_students_id')
    project = models.ForeignKey(Project)
    is_approve = models.BooleanField(default=False)
    meeting = models.ForeignKey(AppointmentSlot, null=True, blank=True)


class FreeMeetingTime(models.Model):
    teacher = models.ForeignKey(User)
    from_date = models.DateTimeField()
    to_date = models.DateTimeField()


class ProjectStatusEnum(enum.Enum):
    REJECTED = 'REJ'
    APPROVED = 'APR'
    INVITED = 'INV'
    SUBMITTED = 'SUB'
    RECOMMENDED = 'REC'

    labels = {
        REJECTED: 'Rejected',
        APPROVED: 'Invited for the practice',
        INVITED: 'Invited for the interview',
        SUBMITTED: 'Submitted',
        RECOMMENDED: 'Recommended',
    }

class ProjectApplication(models.Model):
    class Meta:
        verbose_name = 'Project application'
        verbose_name_plural = 'Project applications'

    candidate = models.ForeignKey(User)
    project = models.ForeignKey(Project, related_name='internship')
    status = models.CharField('Status',
                              max_length=3,
                              choices=ProjectStatusEnum.choices(),
                              default=ProjectStatusEnum.SUBMITTED)

    def __str__(self):
        return self.candidate.username + ' ' \
               + self.project.mentor.username + ' ' \
               + self.project.title[:10]
