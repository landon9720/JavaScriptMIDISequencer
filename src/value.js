import React from 'react'
import { connect } from 'react-redux'

const notActive = 'rowValue'
const active = 'rowValue activeCol'

class Value extends React.Component {
  constructor(props) {
    super(props)
    this.onMouseDown = this.onMouseDown.bind(this)
  }
  onMouseDown() {
    this.props.click(this.props.colIndex)
  }
  render() {
    return (
      <div 
      className={(this.props.rowHasFocus && this.props.colIndex == this.props.activeCol) ? active : notActive} 
      onMouseDown={this.onMouseDown} />
    )
  }
}

export default connect(
  state => { return { 
    activeCol: state.activeColIndex,
  }},
  dispatch => { return {
    click: (colIndex) => { dispatch({ type: 'setActiveColIndex', newActiveColIndex: colIndex })  }
  }}
)(Value)
