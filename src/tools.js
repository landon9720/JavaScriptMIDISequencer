import React from 'react'
import { connect } from 'react-redux'

class Tools extends React.Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }
  onClick() {
    this.props.setInsertCursorMode(!this.props.insertCursorMode)
  }
  render() {
    var currentCursorModeString = this.props.insertCursorMode ? "IN" : "OVER"
    return (
      <div id="tools">
        <button type="button" className="btn btn-info" onClick={this.onClick}>{currentCursorModeString}</button>
        <span className="label label-default">{this.props.currentPositionIndex}</span>
      </div>
    )
  }
}

export default connect(
  store => {
    return {
      currentPositionIndex: store.currentPositionIndex,
      insertCursorMode: store.insertCursorMode
    }
  },
  dispatch => {
    return {
      setInsertCursorMode: i => dispatch({ type: 'setInsertCursorMode', b: i })
    }
  }
)(Tools)
