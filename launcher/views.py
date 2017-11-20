import json

from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render_to_response

from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from launcher.forms import ProjectForm, CreateProjectForm
from launcher.models import StudentApplication, FreeMeetingTime, Project

def index(request):
    return render_to_response(
        'home.html',
        {'user': request.user}
    )

@login_required(login_url='/')
def project(request):
    form = CreateProjectForm()
    mentor = auth.get_user(request)
    massage = ''
    if request.POST:
        form = CreateProjectForm(request.POST)
        if form.is_valid():
            ctx = form.cleaned_data
            Project.objects.create(
                mentor=mentor,
                title=ctx['title'],
                description=ctx['description'],
                state=0
            )
            massage = "Новый проект добавлен!!!"
    return render(request, 'launcher/project.html', {
        'form': form,
        'massage': massage,
    })


@login_required(login_url='/')
def student(request):
    form = ProjectForm()
    student = auth.get_user(request)
    if request.POST:
        form = ProjectForm(request.POST)
        if form.is_valid():
            ctx = form.cleaned_data
            StudentApplication.objects.get_or_create(
                student=student,
                project=ctx['project'],
            )

    applications = StudentApplication.objects.filter(student=student)

    return render(request, 'launcher/student.html', {
        'form': form,
        'applications': applications,
    })


@login_required(login_url='/')
def teacher(request):
    mentor = auth.get_user(request)
    applications = StudentApplication.objects.filter(project__mentor=mentor)

    return render(request, 'launcher/teacher.html', {
        'applications': applications,
    })


@csrf_exempt
def change_status_application(request):
    application_id = request.POST['application_id']
    application = StudentApplication.objects.get(id=application_id)
    if application.is_approve:
        return JsonResponse({'success': False})
    application.is_approve = True
    application.save()
    return JsonResponse({'success': True})

#
# @login_required(login_url='/auth/login/')
# def calendar(request):
#     teacher = auth.get_user(request)
#
#     get_object_or_404(Person, pk=teacher.id, profession=settings.TEACHER)
#
#     student_time_data = StudentApplication.objects \
#         .filter(teacher_id=teacher.id) \
#         .filter(is_approve=True) \
#         .exclude(meeting=None)
#
#     student_time = []
#     for item in student_time_data:
#         date = item.meeting + timedelta(hours=3)
#         person = Person.objects.filter(profession=settings.STUDENT).filter(pk=item.student_id).values().first()
#         student_time.append({
#             'from_date': date.isoformat(timespec='seconds'),
#             'to_date': (date + timedelta(minutes=30)).isoformat(timespec='seconds'),
#             'name': person['first_name'] + ' ' + person['last_name'],
#         })
#
#     meetings_time = []
#     for item in FreeMeetingTime.objects.filter(teacher_id=teacher.id):
#         meetings_time.append({
#             'from_date': (item.from_date + timedelta(hours=3)).isoformat(timespec='seconds'),
#             'to_date': (item.to_date + timedelta(hours=3)).isoformat(timespec='seconds'),
#             'id': item.id,
#         })
#
#     context = {
#         'calendar_id': teacher.id,
#         'meetings_time': meetings_time,
#         'student_time': student_time,
#         'username': teacher.first_name,
#     }
#
#     return render(request, 'launcher/calendar.html', context)
#
#
# @csrf_exempt
# @login_required
# def update_status(request):
#     teacher_id = request.POST['teacher_id']
#     student_id = request.POST['student_id']
#
#     student = get_object_or_404(StudentApplication, student_id=student_id, teacher_id=teacher_id)
#
#     if student:
#         student.is_approve = True
#         student.save()
#         return JsonResponse({'success': True})
#     else:
#         return JsonResponse({'success': False})
#
