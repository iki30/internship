import json

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.mail import send_mail, BadHeaderError
from django.core.urlresolvers import reverse
from django.http import Http404, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.contrib import auth
from django.db.models import Q
from django.utils.translation import ugettext_lazy as _

from datetime import datetime, timedelta
from launcher.models import AppointmentSlot, ProjectApplication, ProjectStatusEnum, Project


@login_required(login_url='/')
def calendar(request):
    return render(request, 'interview/calendar.html')


def send_email(request):
    subject = request.POST.get('subject', '')
    message = request.POST.get('message', '')
    from_email = request.POST.get('from_email', '')
    to_email = request.POST.get('to_email', '')

    if subject and message and from_email and to_email:
        try:
            send_mail(subject, message, from_email, [to_email])
        except BadHeaderError:
            raise Http404('Invalid header found.')
        return render(request, 'base.html')
    else:
        raise Http404('Make sure all fields are entered and valid.')


def get_slots(user):
    slots = []
    for item in AppointmentSlot.objects.filter(user=user):
        id = None
        title = item.user.username
        if item.student:
            id = item.student.id
            if item.student.first_name and item.student.last_name:
                title = item.student.first_name + ' ' + item.student.last_name
            else:
                title = item.student.username
        slots.append({
            'start': (item.start).isoformat(timespec='seconds'),
            'end': (item.end).isoformat(timespec='seconds'),
            'title': title,
            'student': id
        })

    return slots


def save_events_to_appointment_slots(request):
    ctx = json.loads(request.body)
    start = datetime.strptime(ctx['start'], "%Y-%m-%d %H:%M") + timedelta(hours=3)
    end = datetime.strptime(ctx['end'], "%Y-%m-%d %H:%M") + timedelta(hours=3)
    user = auth.get_user(request)
    interval = timedelta(minutes=ctx['interval'])

    while start + interval <= end:
        end_time = start + interval
        slot = AppointmentSlot.objects \
            .filter(user=user) \
            .filter(Q(start__range=[start, end_time - timedelta(minutes=1)]) |
                    Q(end__range=[start + timedelta(minutes=1), end_time]))

        if not len(slot):
            AppointmentSlot.objects.create(user=user,
                                           start=start,
                                           end=end_time,
                                           is_synchronize=False)
        start = end_time

    return JsonResponse({'slots': get_slots(user)})


def get_appointment_slots(request):
    user = auth.get_user(request)
    return JsonResponse({'slots': get_slots(user), 'username': user.username})


def get_teacher_free_slots(request):
    user = auth.get_user(request)
    ctx = json.loads(request.body)
    teacher_id = int(ctx['id'])

    slots = []

    appointment_slot = AppointmentSlot.objects \
        .filter(user_id=teacher_id) \
        .filter(Q(student=user) | Q(student=None))

    for item in appointment_slot:
        title = ''
        if item.student:
            title = (item.start + timedelta(hours=3)).strftime('%H:%M') + ' - ' \
                    + (item.end + timedelta(hours=3)).strftime('%H:%M')
        slots.append({
            'start': (item.start).isoformat(timespec='seconds'),
            'end': (item.end).isoformat(timespec='seconds'),
            'title': title,
        })

    return JsonResponse({'slots': slots})


def delete_appointment_slot(request):
    user = auth.get_user(request)
    ctx = json.loads(request.body)
    start = datetime.strptime(ctx['start'], "%Y-%m-%d %H:%M") + timedelta(hours=3)
    end = datetime.strptime(ctx['end'], "%Y-%m-%d %H:%M") + timedelta(hours=3)
    is_delete = AppointmentSlot.objects \
        .filter(user=user, start=start, end=end) \
        .delete()
    return JsonResponse({'success': True if is_delete[0] else False})


def change_event_to_reserve_slots(request):
    student = auth.get_user(request)
    ctx = json.loads(request.body)
    start = datetime.strptime(ctx['start'], "%Y-%m-%d %H:%M") + timedelta(hours=3)
    end = datetime.strptime(ctx['end'], "%Y-%m-%d %H:%M") + timedelta(hours=3)
    teacher_id = int(ctx['teacher_id'])

    count_reserve_slots = AppointmentSlot.objects.filter(student=student) \
        .filter(Q(start__gte=start, start__lt=end) | Q(end__gt=start, end__lte=end)).__len__()
    if count_reserve_slots:
        return JsonResponse({'error': True})

    slot = AppointmentSlot.objects \
        .get(user_id=teacher_id, start=start, end=end)
    slot.student = student
    slot.save()

    slots = []

    appointment_slot = AppointmentSlot.objects \
        .filter(user_id=teacher_id) \
        .filter(Q(student=student) | Q(student=None))

    for item in appointment_slot:
        title = ''
        if item.student:
            title = (item.start + timedelta(hours=3)).strftime('%H:%M') + ' - ' \
                    + (item.end + timedelta(hours=3)).strftime('%H:%M')
        slots.append({
            'start': (item.start).isoformat(timespec='seconds'),
            'end': (item.end).isoformat(timespec='seconds'),
            'title': title,
        })

    for application in ProjectApplication.objects.filter(candidate=student, project__mentor_id=teacher_id):
        application.status = ProjectStatusEnum.APPROVED
        application.save()

    return JsonResponse({'slots': slots})


def get_student_info(request):
    ctx = json.loads(request.body)
    student_id = int(ctx['id'])

    applications = ProjectApplication.objects.filter(candidate_id=student_id)
    user = auth.get_user(request)

    # student = StudentProfile.objects.get(user_id=student_id)

    desc = []
    for app in applications:
        status_color = ' _nothing'
        if app.status == ProjectStatusEnum.APPROVED:
            status_color = " _agree"
        elif app.status == ProjectStatusEnum.SUBMITTED:
            status_color = " _nothing"
        elif app.status == ProjectStatusEnum.REJECTED:
            status_color = " _fault"
        desc.append({'desc': app.project.description, 'status': status_color})

    return JsonResponse({
        "title": 'Application',
        "give_review": 'GIVE A REVIEW',
        "username": user.first_name,
        "university": 'СПбГУ',
        "applications": desc,
        "image": 'temp'
    })


def selection_slot(request, id):
    teacher = get_object_or_404(User.objects.filter(id=id))

    return render(request, 'interview/selection_slot.html', {'teacher_id': teacher.id})


def translate_calendar(request):
    return JsonResponse({
        "calendar_title": 'Schedule interviews',
        "localization": 'ru',
        "slider_text": {
            "duration": 'The duration of one interview: ',
            "expect_interview": 'Expect interview',
            "slot_interview": 'Slots for the interview',
            "time": {
                "30": '30 min',
                "45": '45 min',
                "60": '1 h',
                "75": '1 h 15 min',
                "90": '1 h 30 min',
                "105": '1 h 45 min',
                "120": '2 h'
            }
        }
    })


def scheduler_student_base(request):
    ctx = json.loads(request.body)
    mentor_id = int(ctx['id'])
    mentor = User.objects.get(pk=mentor_id)
    projects = []
    for project in Project.objects.filter(mentor_id=mentor_id):
        projects.append({'description': project.description})
    return JsonResponse({
        "calendar_title": 'My schedule',
        "title_choose": 'Choose a time for the interview',
        "title_event": 'free',
        "mentor_project_title": 'Mentor project ',
        "mentor_project": mentor.username,
        "project_title": 'Project(s)',
        "projects": projects,
        "place_title": 'Place ',
        "place": 'Temp place title',
        "localization": 'ru',
        "herf_back": reverse('interview:scheduler_student'),
        "button_back": 'BACK',
        "button_assign": 'Assign slot',

    })


def scheduler_student(request):
    return render(request, 'interview/scheduler_student.html')


def get_reserve_slot(request):
    user = auth.get_user(request)
    appointment_slots = []
    for slot in AppointmentSlot.objects.filter(student=user):
        appointment_slots.append({
            'start': (slot.start).isoformat(timespec='seconds'),
            'end': (slot.end).isoformat(timespec='seconds'),
            'title': slot.user.__str__(),
            'id': slot.id,
        })
    projects = []
    for application in ProjectApplication.objects.filter(status=ProjectStatusEnum.INVITED,
                                                         candidate=user):
        project = application.project
        projects.append({'description': project.description,
                         'title_button': "CHOOSE TIME",
                         'title': "%(name)s invited you to the interview" % \
                                  {
                                      'name': project.mentor.__str__(),
                                  },
                         'href': "url temp",
                         'href_project': "url temp",
                         'project_word': "Project",
                         })

    return JsonResponse({
        "calendar_title": 'My schedule',
        "localization": 'ru',
        'slots': appointment_slots,
        'projects': projects,
    })
