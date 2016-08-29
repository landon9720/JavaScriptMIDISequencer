import React from 'react'
import { connect } from 'react-redux'

import Row from './row.js'

class Matrix extends React.Component {
  constructor(props) {
    super(props)
    this.onFocus = this.onFocus.bind(this)
    this.onSetValue = this.onSetValue.bind(this)    
  }
  onFocus(rowName) {
    this.props.setActiveRow(this.props.matrix.name, rowName)
  }
  onSetValue(rowName, value) {
    this.props.setValue(this.props.matrixName, rowName, value)
  }
  render() {
    const values = [...Array(24).keys()].map(i => {
      const className =
        i == this.props.currentPositionIndex ?
          'value active' : 'value'
      return <div key={i} className={className}></div>
    })
    const rows = this.props.matrix.get('rows').map((row, rowName) =>
      <Row key={rowName} rowName={rowName} row={row} onFocus={this.onFocus} onSetValue={this.onSetValue} />
    ).valueSeq()
    return (
      <div className="matrix">
        <div className="matrixHeading">
          <div className="matrixName">{this.props.matrixName}</div>
          <div className="matrixTimeSeries">{values}</div>
        </div>
        <div className="matrixRowArea">{rows}</div>
      </div>
    )
  }
}

export default connect(
  state => {
    return {
      currentPositionIndex: state.currentPositionIndex
    }
  },
  dispatch => {
    return {
      setActiveRow: (matrixName, rowName) =>
        dispatch({ type: 'setActiveRow', path: [matrixName, rowName] }),
      setValue: (matrixName, rowName, value) =>
        dispatch({ type: 'setValue', path: [matrixName, rowName, value] })
    }
  }
)(Matrix)
