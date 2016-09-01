import React from 'react'
import { connect } from 'react-redux'

import Row from './row.js'

class Matrix extends React.Component {
  constructor(props) {
    super(props)
    this.onFocus = this.onFocus.bind(this)
    this.onInputValue = this.onInputValue.bind(this)    
    this.onBackspaceValue = this.onBackspaceValue.bind(this)
  }
  onFocus(rowName) {
    this.props.setActiveRow(this.props.matrixName, rowName)
  }
  onInputValue(rowName, value) {
    this.props.inputValue(this.props.matrixName, rowName, value)
  }
  onBackspaceValue(rowName) {
    this.props.backspaceValue(this.props.matrixName, rowName)
  }
  render() {
    const values = [...Array(24).keys()].map(i => {
      const className =
        i == this.props.currentPositionIndex ?
          'danger' : ''
      return <th key={i} className={className}></th>
    })
    const rows = this.props.matrix.get('rows').map((row, rowName) =>
      <Row key={rowName} rowName={rowName} row={row} onFocus={this.onFocus} onInputValue={this.onInputValue} onBackspaceValue={this.onBackspaceValue} />
    ).valueSeq()
    return (
      <table className="table matrix">
        <thead>
          <tr>
            <th className="col0">{this.props.matrixName}</th>
            {values}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
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
      inputValue: (matrixName, rowName, value) =>
        dispatch({ type: 'inputValue', path: [matrixName, rowName, value] }),
      backspaceValue: (matrixName, rowName) =>
        dispatch({ type: 'backspaceValue', path: [matrixName, rowName] })
    }
  }
)(Matrix)
