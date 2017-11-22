from django.contrib import auth
from django.shortcuts import render, redirect

from login.forms import *
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout, login, authenticate
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from django.template import RequestContext


@csrf_protect
def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            user = User.objects.create_user(
                username=username,
                password=password,
                email=form.cleaned_data['email'],
                is_staff=form.cleaned_data['staff']
            )
            person = authenticate(username=username, password=password)
            auth.login(request, person)
            return HttpResponseRedirect('/')
    else:
        form = RegistrationForm()
    variables = RequestContext(request, {
        'form': form
    })

    return render_to_response(
        'registration/register.html',
        variables,
    )

@csrf_exempt
def register_success(request):
    return render_to_response(
        'registration/success.html',
    )


def logout_page(request):
    logout(request)
    return HttpResponseRedirect('/')


@login_required
def home(request):
    return render_to_response(
        'home.html',
        {'user': request.user}
    )

@csrf_exempt
def login(request):
    if request.POST:
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        person = authenticate(username=username, password=password)
        if person:
            auth.login(request, person)
            # if person.profession == 's':
            #     url_type = 'student'
            # else:
            #     url_type = 'teacher'

            return HttpResponseRedirect('/')
        else:
            args = {'login_error': "Проверьте имя или пароль"}
            return HttpResponseRedirect('/')
    else:
        return HttpResponseRedirect('/')
