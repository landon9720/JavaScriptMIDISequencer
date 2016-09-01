import React from 'react'
import { connect } from 'react-redux'
import Panel from './panel.js'

class Tools extends React.Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }
  onClick() {
    this.props.setCursorMode((this.props.cursorMode + 1) % 3)
  }
  render() {
    var currentCursorModeString
    switch (this.props.cursorMode) {
      case 0: currentCursorModeString = "overwrite"
        break
      case 1: currentCursorModeString = "insert 1"
        break
      case 2: currentCursorModeString = "insert *"
        break
    }
    return (
      <a href="#" className="btn btn-primary" onClick={this.onClick}>{currentCursorModeString}</a>
    )
  }
}

export default connect(
  store => {
    return {
      cursorMode: store.cursorMode
    }
  },
  dispatch => {
    return {
      setCursorMode: i => dispatch({ type: 'setCursorMode', value: i })
    }
  }
)(Tools)
