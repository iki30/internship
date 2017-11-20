import React, {Component} from 'react';
import moment from 'moment';
import BigCalendar from '../../../react-big-calendar/index';
import Toolbar from '../toolbar.jsx';
import getHeadersRequest from "../../../utils.js"

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
            timeslots: 2,
            username: '',
            teacher_id: props.teacher_id,
            is_once: false,
            urls: props,
            culture: 'en',
            title: 'My schedule',
            choice_slot: -1,
            mentor_project_title: '',
            mentor_project: '',
            project_title: '',
            projects: [],
            place_title: '',
            title_choose: '',
            title_event: 'free',
            place: '',
            herf_back: '',
            button_back: '',
            button_assign: '',
        };
        fetch(this.state.urls['_url_scheduler_student_base'], {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify({id: props.teacher_id}),
            headers: getHeadersRequest()
        }).then((response) => response.json())
            .then((data) => {
                this.setState({
                    culture: data.localization,
                    title: data.calendar_title,
                    mentor_project_title: data.mentor_project_title,
                    mentor_project: data.mentor_project,
                    project_title: data.project_title,
                    projects: data.projects,
                    place_title: data.place_title,
                    place: data.place,
                    title_choose: data.title_choose,
                    title_event: data.title_event,
                    herf_back: data.herf_back,
                    button_back: data.button_back,
                    button_assign: data.button_assign,
                });
            });
        this.fetch_csrf_post_request(this.state.urls['_url_get_teacher_free_slots'], JSON.stringify({
            id: props.teacher_id,
        }));
    }

    fetch_csrf_post_request(url, json_str) {
        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            body: json_str,
            headers: getHeadersRequest()
        }).then((response) => response.json())
            .then((data) => {
            if (data.error) {
                alert('Please, take another different slot.  ')
            }
                let slots = data.slots;
                let events = [];
                let is_once = false;
                slots = data.slots.map((slot) => {
                    let is_appointment_slot = false;
                    let title = this.state.title_event;
                    if (slot.title) {
                        title = slot.title;
                        is_once = true;
                        is_appointment_slot = true;
                    }
                    events.push({
                        'title': title,
                        'start': new Date(slot.start),
                        'end': new Date(slot.end),
                        'is_appointment_slot': is_appointment_slot,
                        'is_choice': false,
                    })
                });
                this.setState({
                    events: events,
                    username: data.username,
                    is_once: is_once,
                });
            });
    }

    changeEventPersone(event) {
        if (this.state.is_once) {
            alert('You have selected a slot');
            return;
        }

        if (this.state.choice_slot != -1) {
            this.state.events[this.state.choice_slot].title = this.state.title_event;
            this.state.events[this.state.choice_slot].is_choice = false;
        }
        let event_id = this.state.events.indexOf(event);
        if (this.state.choice_slot == event_id) {
            event_id = -1;
        } else {
            this.state.events[event_id].title = event.start.getHours() + ':' + event.start.getMinutes() + ' - '
                + event.end.getHours() + ':' + event.end.getMinutes();
            this.state.events[event_id].is_choice = true;
        }
        this.setState({
            choice_slot: event_id
        })
    }

    eventStyleGetter(event) {
        let background_color = "#c3c3c3";
        let border_color = '#818181'
        let color = 'black';
        let opacity = '0.7';
        if (event.is_choice) {
            background_color = "#afe1fe";
            color = 'white'
            opacity = '1'
            border_color = "#238BCE";
        } else {
            if (event.is_appointment_slot) {
                background_color = "#27a4f7";
                color = 'white'
                opacity = '1'
                border_color = "#238BCE";
            }
        }

        let style = {
            backgroundColor: background_color,
            borderRadius: '0px',
            borderCollapse: 'collapse',
            color: color,
            border: '1px solid ' + border_color,
            paddingLeft: '10px',
            opacity: opacity
        };
        return {
            style: style
        };
    }

    submitEvent() {
        let event = this.state.events[this.state.choice_slot];
        this.fetch_csrf_post_request(this.state.urls['_url_change_event_to_reserve_slots'], JSON.stringify({
            start: get_datetime_format(event.start),
            end: get_datetime_format(event.end),
            teacher_id: this.state.teacher_id
        }));
    }

    render() {
        let today = moment();
        let am8 = today.set('hour', 8).set('minutes', 0).toDate();
        let pm8 = today.set('hour', 21).set('minutes', 0).toDate();
        let disabled = ' _disabled';
        if (this.state.choice_slot != -1) {
            disabled = '';
        }
        let battun_activate = (
            <div className="g-col-3 _spacer">
                <button className={"button" + disabled} onClick={this.submitEvent.bind(this)}>
                    {this.state.button_assign}
                </button>
            </div>
        );
        if (this.state.is_once) {
            battun_activate = '';
        }
        return (
            <div>
                <h1><strong>{this.state.title}</strong></h1>
                <h3>{this.state.title_choose}</h3>
                <div className="g-row _valign-middle">
                    <div className="g-col-2 _spacer">
                        <span>{this.state.mentor_project_title}</span>
                    </div>
                    <div className="g-col">{this.state.mentor_project}</div>
                </div>
                <div className="g-row _valign-middle">
                    <div className="g-col-2 _spacer">
                        <span>{this.state.project_title}</span>
                    </div>
                    {this.state.projects.map((project, index, {length}) => {
                        let str = '';
                        if (index + 1 === length && (length !== 1)) { //last element
                            str = ', '
                        }
                        return (
                            <span>{str}<a href={project.href}>{project.description}</a></span>
                        )
                    })}
                </div>
                <div className="g-row _valign-middle">
                    <div className="g-col-2 _spacer">
                        <span>{this.state.place_title}</span>
                    </div>
                    <div className="g-col">{this.state.place}</div>
                </div>
                <div className="g-row" style={{'height': '800px'}}>
                    <BigCalendar
                        culture={this.state.culture}
                        events={this.state.events}
                        min={am8}
                        max={pm8}
                        defaultView={'week'}
                        onSelectEvent={time => this.changeEventPersone(time)}
                        eventPropGetter={event => this.eventStyleGetter(event)}
                        formats={{timeGutterFormat: 'H:00'}}
                        step={this.state.step}
                        timeslots={this.state.timeslots}
                        components={{
                            toolbar: Toolbar,
                        }}
                    />
                </div>
                <br/>
                <div className="g-row _valign-middle">
                    {battun_activate}
                    <div className="g-col">
                        <a href={this.state.herf_back}><strong>{this.state.button_back}</strong></a>
                    </div>
                </div>
                <br/>
            </div>
        );
    }
}

export default Calendar