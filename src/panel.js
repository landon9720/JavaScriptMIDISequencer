import React from 'react'

export default class Panel extends React.Component {
    constructor(props) {
        super(props)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onClick = this.onClick.bind(this)
    }
    onMouseDown(e) {
        e.stopPropagation()
        if (this.props.onMouseDown) {
           this.props.onMouseDown(e)
        }
    }
    onClick(e) {
        e.stopPropagation()
        if (this.props.onClick) {
            this.props.onClick(e)
        }
    }
    render() {
        const brand = this.props.brand || "default"
        const className = `panel panel-${this.props.brand} ${(this.props.className ? this.props.className : '')}`
        const title = this.props.title ? <div className="panel-heading">{this.props.title}</div> : null
        const footer = this.props.footer ? <div class="panel-footer">this.props.footer</div> : null
        return (
            <div className={className} onMouseDown={this.onMouseDown} onClick={this.onClick}>
                {title}
                <div className="panel-body">{this.props.children}</div>
                {footer}
            </div>
        )
    }
}
