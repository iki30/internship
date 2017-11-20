import React, {Component} from 'react';
import getHeadersRequest from "../../../utils.js"
import ToolTip from 'react-portal-tooltip'


export default class EventTooltip extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isTooltipActive: false,
            parent: props.parent,
            title: props.title,
            label_time: props.label_time,
            place: props.place,
        };
    }

    showTooltip() {
        this.setState({isTooltipActive: true})
    }
    hideTooltip() {
        this.setState({isTooltipActive: false})
    }

    render() {
        return (
            <div>
                <p id={this.state.parent} onMouseEnter={this.showTooltip.bind(this)} onMouseLeave={this.hideTooltip.bind(this)}
                style={{'height': '5em'}}>
                    {this.state.title}
                </p>
                <ToolTip active={this.state.isTooltipActive}
                         position="right"
                         arrow="center"
                         parent={'#' + this.state.parent}
                         tooltipTimeout="100"
                >
                    <div className="student-event-tooltip">
                        <div className="student-event-tooltip__text">
                            <p className="student-event-tooltip__text-name">{this.state.title}</p>
                            <br/>
                            <strong>Собеседование</strong>
                            <br/>
                            <div className="student-event-tooltip__text-description">
                                <p>{this.state.label_time}</p>
                                <p>{this.state.place}</p>
                            </div>
                        </div>
                    </div>
                </ToolTip>
            </div>
        )
    };
}
