import React from 'react';
import ReactDOM from 'react-dom';
import Calendar from "./calendar.jsx";

ReactDOM.render(<Calendar
        _url_get_appointment_slots={calendar.dataset.urlGetAppointmentSlots}
        _url_save_events_to_appointment_slots={calendar.dataset.urlSaveEventsToAppointmentSlots}
        _url_delete_appointment_slot={calendar.dataset.urlDeleteAppointmentSlot}
        _url_translate_calendar={calendar.dataset.urlTranslateCalendar}
    />,
    calendar
);


