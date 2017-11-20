import React from 'react';
import ReactDOM from 'react-dom';
import Calendar from "./scheduler.jsx";


ReactDOM.render(
    <Calendar
        teacher_id={_teacher_id}
        _url_scheduler_student_base={_url_scheduler_student_base}
        _url_get_teacher_free_slots={_url_get_teacher_free_slots}
        _url_change_event_to_reserve_slots={_url_change_event_to_reserve_slots}

    />,
    document.getElementById('select_slot')
);


