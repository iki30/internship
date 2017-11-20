from django.conf.urls import url

from . import views

app_name = 'interview'
urlpatterns = [
    url(
        regex=r'^calendar/$',
        view=views.calendar,
        name='calendar'
    ),
    # url(
    #     regex=r'^calendar/export/$',
    #     view=views.export_date,
    #     name='export_date'
    # ),
    # url(
    #     regex=r'^calendar/auth/callback/$',
    #     view=views.auth_callback,
    #     name='auth_callback'
    # ),
    url(
        regex=r'^calendar/send_email/$',
        view=views.send_email,
        name='send_email'
    ),
    url(
        regex=r'^calendar/save_events_to_appointment_slots/$',
        view=views.save_events_to_appointment_slots,
        name='save_events_to_appointment_slots'
    ),
    url(
        regex=r'^calendar/get_appointment_slots/$',
        view=views.get_appointment_slots,
        name='get_appointment_slots'
    ),
    url(
        regex=r'^calendar/get_teacher_free_slots/$',
        view=views.get_teacher_free_slots,
        name='get_teacher_free_slots'
    ),
    url(
        regex=r'^calendar/get_student_info/$',
        view=views.get_student_info,
        name='get_student_info'
    ),
    url(
        regex=r'^calendar/delete_appointment_slot/$',
        view=views.delete_appointment_slot,
        name='delete_appointment_slot'
    ),
    url(
        regex=r'^calendar/change_event_to_reserve_slots/$',
        view=views.change_event_to_reserve_slots,
        name='change_event_to_reserve_slots'
    ),
    url(
        regex=r'^calendar/selected/(?P<id>[0-9]+)$',
        view=views.selection_slot,
        name='selection_slot'
    ),
    url(
        regex=r'^calendar/translate_calendar/$',
        view=views.translate_calendar,
        name='translate_calendar'
    ),
    url(
        regex=r'^calendar/scheduler_student_base/$',
        view=views.scheduler_student_base,
        name='scheduler_student_base'
    ),
    url(
        regex=r'^calendar/selected/$',
        view=views.scheduler_student,
        name='scheduler_student'
    ),
    url(
        regex=r'^calendar/get_reserve_slot/$',
        view=views.get_reserve_slot,
        name='get_reserve_slot'
    ),
]