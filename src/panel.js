import React from 'react'

export default class Panel extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const title = this.props.title ? <div className="panel-heading">{this.props.title}</div> : null
        const className = "panel panel-primary " + (this.props.className ? this.props.className : '')
        return (
            <div className={className}>
                {title}
                <div className="panel-body">{this.props.children}</div>
            </div>
        )
    }
}
