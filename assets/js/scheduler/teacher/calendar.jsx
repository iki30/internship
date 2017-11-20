import React, {Component} from 'react';
import moment from 'moment';

import BigCalendar from '../../react-big-calendar/index';
import Toolbar from './toolbar.jsx';
import Tooltip from 'rc-tooltip';
import CalendarTooltip from './tooltip.jsx'

import SliderCalendar from './slider.jsx'
import getHeadersRequest from "../../utils.js"

import * as ICS from 'ics-js';

BigCalendar.momentLocalizer(moment);


function get_datetime_format(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' '
        + (date.getHours() - 3) + ':' + date.getMinutes();
}


class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [{}],
            step: 60,
            timeslots: 1,
            apointment_slots: 0,
            username: '',
            awaitings: 0,
            urls: props,
            calendar_title: '',
            slider_text: '',
            culture: 'en'
        };
        fetch(props._url_translate_calendar,
            {
                method: 'POST',
                credentials: 'same-origin',
                headers: getHeadersRequest()
            }).then((response) => response.json())
            .then((data) => {
                this.setState({
                    calendar_title: data.calendar_title,
                    slider_text: data.slider_text,
                    culture: data.localization,
                });
            });
        this.fetchWithCSRF(this.state.urls['_url_get_appointment_slots'], '');
    }

    fetchWithCSRF(url, json_str) {
        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            body: json_str,
            headers: getHeadersRequest()
        }).then((response) => response.json())
            .then((data) => {
                let slots = data.slots;
                let events = [];
                let awaitings = 0;
                slots.map(function (slot) {
                    let title = '';
                    if (slot.student) {
                        awaitings++;
                        title = slot.title;
                    }
                    events.push({
                        'title': title,
                        'start': new Date(slot.start),
                        'end': new Date(slot.end),
                        'student': slot.student,
                        'isActive': true
                    })
                });
                this.setState({
                    events: events,
                    apointment_slots: slots.length - awaitings,
                    username: data.username,
                    awaitings: awaitings,
                });
            });
    }

    createEvent(time) {
        this.fetchWithCSRF(this.state.urls['_url_save_events_to_appointment_slots'], JSON.stringify({
            start: get_datetime_format(time.start),
            end: get_datetime_format(time.end),
            interval: this.state.step
        }));
    }

    eventStyleGetter(event) {
        let color = "#eaeaec";
        if (event.title) {
            color = "#ffc0cb";
        }
        let style = {
            backgroundColor: color,
            borderRadius: '0px',
            borderCollapse: 'collapse',
            color: 'black',
            borderColor: 'black',
            border: '0.5px solid #818181',
        };
        return {
            style: style
        };
    }

    closeEvent(event) {
        let events = this.state.events;
        let idx = events.indexOf(event);
        const nextEvents = this.state.events;
        let deleteEvent = this.state.events[idx];
        nextEvents.splice(idx, 1);

        this.setState({
            events: nextEvents,
            apointment_slots: this.state.apointment_slots - 1,
        });

        fetch(this.state.urls['_url_delete_appointment_slot'], {
            method: 'POST',
            body: JSON.stringify({
                start: get_datetime_format(deleteEvent.start),
                end: get_datetime_format(deleteEvent.end),
            }),
            credentials: 'same-origin',
            headers: getHeadersRequest()
        })
    }

    EventWeek(props) {
        let close_button = (
            <a className="close-event" onClick={this.closeEvent.bind(this, props.event)}>
                {/*<a className="close-event__icon"></a>*/}
            </a>
        );
        let tooltip = '';
        if (props.event.title) {
            close_button = '';
            tooltip = <Tooltip
                placement={'right'}
                trigger={['hover']}
                mouseEnterDelay={0.2}
                overlay={<CalendarTooltip
                    student_id={props.event.student}
                    start={props.event.start}
                    end={props.event.end}
                    title={props.title}
                />}

            >
                <span>{props.title}</span>
            </Tooltip>
        }
        return <div>{tooltip}{close_button}</div>
    }

    change_slider_field(step) {
        this.setState({
            step: step
        });
    }

    render() {
        let today = moment();
        let am8 = today.set('hour', 8).set('minutes', 0).toDate();
        let pm8 = today.set('hour', 21).set('minutes', 0).toDate();
        let slider = '';
        if (this.state.slider_text) {
            slider = <SliderCalendar
                step={this.state.step}
                awaitings={this.state.awaitings}
                apointment_slots={this.state.apointment_slots}
                change_slider_field={this.change_slider_field.bind(this)}
                slider_text={this.state.slider_text}/>;
        }
        return (
            <div>
                <h1><strong>{this.state.calendar_title}</strong></h1>
                {slider}
                <br/>
                <br/>
                <div className="row">
                    <BigCalendar
                        culture={this.state.culture}
                        selectable
                        events={this.state.events}
                        min={am8}
                        max={pm8}
                        defaultView={'week'}
                        onSelectSlot={time => this.createEvent(time)}
                        eventPropGetter={event => this.eventStyleGetter(event)}
                        formats={{
                            timeGutterFormat: 'H:00',
                        }}
                        step={this.state.step}
                        timeslots={2}
                        components={{
                            event: this.EventWeek.bind(this),
                            toolbar: Toolbar,
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default Calendar