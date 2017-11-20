import React from 'react';
import ReactDOM from 'react-dom';
import Calendar from "./scheduler.jsx";


ReactDOM.render(
    <Calendar
        _url_get_reserve_slot={_url_get_reserve_slot}

    />,
    document.getElementById('scheduler_student')
);


