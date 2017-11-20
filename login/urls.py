from django.conf.urls import url
from . import views

app_name = 'login'
urlpatterns = [
    url(r'^login/$', views.login, name='login'),
    url(r'^home/$', views.home, name='home'),
    url(r'^register/$', views.register, name='register'),
    url(r'^register/success/$', views.register_success, name='register_success'),
    url(r'^logout/$', views.logout_page, name='logout'),
]