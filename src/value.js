import React from 'react'
import { connect } from 'react-redux'

class Value extends React.Component {
  constructor(props) {
    super(props)
    this.onMouseDown = this.onMouseDown.bind(this)
  }
  onMouseDown() {
    this.props.click(this.props.colIndex)
  }
  render() {
    const vstr = ! this.props.value ? "\u00a0" : this.props.value
    return (
      <td
        className={(this.props.rowHasFocus && this.props.colIndex == this.props.activeCol) ? 'activeCol' : ''}
        onMouseDown={this.onMouseDown}>
        {vstr}
      </td>
    )
  }
}

export default connect(
  state => {
    return {
      activeCol: state.activeColIndex,
    }
  },
  dispatch => {
    return {
      click: colIndex => { dispatch({ type: 'setActiveColIndex', newActiveColIndex: colIndex }) }
    }
  }
)(Value)
