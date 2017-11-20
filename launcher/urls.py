from django.conf.urls import url

from . import views

app_name = 'scheduler'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^project/$', views.project, name='project'),
    url(r'^student/$', views.student, name='student'),
    url(r'^teacher/$', views.teacher, name='teacher'),
    url(r'^change_status_application/$', views.change_status_application, name='change_status_application'),
]