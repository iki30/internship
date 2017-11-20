import React, {Component} from 'react';

export default class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.navigate = (action) => this.props.onNavigate(action);
        this.view = (view) => this.props.onViewChange(view);
    }

    render() {
        let _props = this.props,
            label = _props.label;
        return (
            <div className="toolbar-calendar">
            <div className="g-row">
                <div className="g-col-3" style={{'height': '40px'}}></div>
                <div className="g-col-7"></div>
                <div className="g-col _justify-end">
                    <div className="toolbar-navigation">
                        <div className="toolbar-navigation__prev">
                            <a className="toolbar-navigation__link"
                               type={'button'}
                               onClick={this.navigate.bind(null, "PREV")}>
                                <span className="toolbar-navigation__link-size">
                                    &#10094;
                                </span>
                            </a>
                        </div>
                        <div className="toolbar-navigation__next">
                            <a className="toolbar-navigation__link"
                               type={'button'}
                               onClick={this.navigate.bind(null, "NEXT")}>
                                <span className="toolbar-navigation__link-size">
                                    &#10095;
                                </span>
                            </a>
                        </div>
                        <div className="toolbar-navigation__text">
                            <span>{label}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    };
}
