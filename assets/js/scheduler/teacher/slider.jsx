import React, {Component} from 'react';
import Slider from 'rc-slider';


export default class SliderCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slider_text: props.slider_text
        }
    }

    render() {
        let style_slider_text = function (value) {
            return {
                value: value,
                label: <strong>{value}</strong>,
                style: {color: 'black',}
            };
        };
        let marks = {
            30: {
                value: this.state.slider_text.time[30],
                label: <strong>{this.state.slider_text.time[30]}</strong>,
                style: {color: 'black', 'marginLeft': '-5%'}
            },
            45: style_slider_text(this.state.slider_text.time[45]),
            60: style_slider_text(this.state.slider_text.time[60]),
            75: style_slider_text(this.state.slider_text.time[75]),
            90: style_slider_text(this.state.slider_text.time[90]),
            105: style_slider_text(this.state.slider_text.time[105]),
            120: style_slider_text(this.state.slider_text.time[120])
        };
        return <div className="row">
                <div className="col-md-6">
                    <p>
                        {this.state.slider_text.duration}
                        <span className="duration-interview">
                            {marks[this.props.step].value}
                        </span>
                    </p>
                    <br/>
                    <Slider
                        dots
                        min={30}
                        max={120}
                        marks={marks}
                        step={30}
                        included={false}
                        defaultValue={60}
                        onAfterChange={item => this.props.change_slider_field(item)}

                    />
                </div>
                <div className="col-md-1"></div>
                <div className="col-md-3">
                    <p>
                        {this.state.slider_text.expect_interview + ' '}
                        <span className="expect-interview">{this.props.awaitings}</span>
                    </p>
                    <br/>
                    <p>
                        {this.state.slider_text.slot_interview + ' '}
                        <span className="appointent-slot">{this.props.apointment_slots}</span>
                    </p>
                </div>
        </div>
    };
}
