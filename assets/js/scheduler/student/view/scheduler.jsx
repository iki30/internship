import React, {Component} from 'react';
import moment from 'moment';
import BigCalendar from '../../../react-big-calendar/index';
import Toolbar from '../toolbar.jsx';
import getHeadersRequest from "../../../utils.js";
import EventTooltip from './tooltip.jsx';

BigCalendar.momentLocalizer(moment);


class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [{}],
            step: 60,
            timeslots: 2,
            urls: props,
            culture: 'en',
            title: 'My schedule',
            projects_aplications: [],
            project_word: '',
            place: 'Temp place',
            event_id: 'event-id-',
        };
        fetch(this.state.urls['_url_get_reserve_slot'], {
            method: 'POST',
            credentials: 'same-origin',
            headers: getHeadersRequest()
        }).then((response) => response.json())
            .then((data) => {
                let events = [];
                events = (data.slots.map((event) => {
                    return {
                        'title': event.title,
                        'start': new Date(event.start),
                        'end': new Date(event.end),
                        'id': this.state.event_id + event.id,
                    };
                }))
                this.setState({
                    culture: data.localization,
                    title: data.calendar_title,
                    events: events,
                    projects_aplications: data.projects,
                    project_word: data.project_word,
                });
            });
    }

    eventStyleGetter(event) {
        let style = {
            backgroundColor: "#c3eab7",
            borderRadius: '0px',
            borderCollapse: 'collapse',
            color: 'black',
            border: '0.5px solid black',
            paddingLeft: '10px',
            opacity: '0.7'
        };
        return {
            style: style
        };
    }

    EventWeek(data) {
        let parent = data.event.id;
        let label_time = data.event.start.getHours() + ':' + data.event.start.getMinutes() + ' - '
                + data.event.end.getHours() + ':' + data.event.end.getMinutes();
        return <EventTooltip parent={parent}
                             label_time={label_time}
                             title={data.title}
                             place={this.state.place}
        />
    }

    render() {
        let today = moment();
        let am8 = today.set('hour', 8).set('minutes', 0).toDate();
        let pm8 = today.set('hour', 21).set('minutes', 0).toDate();
        return (
            <div>
                <h1><strong>{this.state.title}</strong></h1>
                {this.state.projects_aplications.map((project) => {
                    return (
                        <div className="g-row scheduler-project-application">
                            <div className="g-col-9 scheduler-project-application__info">
                                <div className="scheduler-project-application__info-text">
                                    <p>{project.title}</p>
                                    <span>
                                        {project.project_word + ': '}
                                        <a href={project.href_project}>
                                            {project.description}
                                        </a>
                                    </span>
                                </div>
                            </div>
                            <div className="g-col-2">
                                <a href={project.href} style={{'text-decoration': 'none'}}>
                                    <div className="scheduler-project-application__submit">
                                        <div className="scheduler-project-application__submit-text">
                                            {project.title_button}
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    );
                })}
                <div className="g-row" style={{'height': '1000px'}}>
                    <BigCalendar
                        culture={this.state.culture}
                        events={this.state.events}
                        min={am8}
                        max={pm8}
                        defaultView={'week'}
                        eventPropGetter={event => this.eventStyleGetter(event)}
                        formats={{timeGutterFormat: 'H:00'}}
                        step={this.state.step}
                        timeslots={this.state.timeslots}
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