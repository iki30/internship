import React, {Component} from 'react';
import getHeadersRequest from "../../utils.js"

function DescList(props) {
    let desc = props.desc.map(function (ctx) {
        return <div className="g-row">
            <div className="g-col-10">
                <div className={'calendar-tooltip__item-status' + ctx.status}></div>
                <div className='calendar-tooltip__item-text'>{ctx.desc}</div>
            </div>
        </div>
    })

    return <div>{desc}</div>
}

export default class CalendarTooltip extends Component {
    constructor(props) {
        super(props);
        fetch('/calendar/get_student_info/', {
            method: 'POST',
            body: JSON.stringify({
                id: props.student_id,
            }),
            credentials: 'same-origin',
            headers: getHeadersRequest()
        }).then((response) => response.json())
            .then((data) => {
            this.setState({
                name: data.username,
                give_review: data.give_review,
                title: data.title,
                university: data.university,
                applications: data.applications,
                image: data.image,
            });
        });
        this.state = {
            name: '',
            university: '',
            applications: [],
            give_review: "GIVE A REVIEW",
            title: "Applications",
            image: '',
            start: props.start,
            end: props.end,
            title_event: props.title,
        };
    }

    icsBuld() {
        var cal = ics();
        cal.addEvent(
            this.state.title_event,
            "Время собеседования",
            'Место',
            this.state.start.toLocaleString("en-US").replace(',', ''),
            this.state.end.toLocaleString("en-US").replace(',', '')
        );
        cal.download()
    }

    render() {
        return <div className="calendar-tooltip">
            <div className="g-row _valign-middle">
                <div className="g-col-4">
                    <img
                        className="calendar-tooltip__image"
                        src={this.state.image}
                        alt={'Student pictures'}
                    />
                </div>
                <div className="g-col-2"></div>
                <div className="g-col-6">
                    <p className="calendar-tooltip__name">{this.state.name}</p>
                    <p className="calendar-tooltip__university">{this.state.university}</p>
                </div>
            </div>
            <p className="calendar-tooltip__title">{this.state.title}</p>
            <DescList desc={this.state.applications}/>
            <button className="btn btn-default" onClick={this.icsBuld.bind(this)}>{"Экспорт слота"}</button>
        </div>
    };
}
