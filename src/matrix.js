import React from 'react'
import { connect } from 'react-redux'

import Row from './row.js'
import { stringToKind } from './store.js'

class Matrix extends React.Component {
  constructor(props) {
    super(props)
    this.onFocus = this.onFocus.bind(this)
    this.onInputValue = this.onInputValue.bind(this)
    this.onBackspaceValue = this.onBackspaceValue.bind(this)
    this.kind = stringToKind(this.props.matrix.get('kind'))
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
    const values = [...Array(this.kind.cols).keys()].map(i => {
      const className = i == this.props.currentPositionIndex ? 'transport' : ''
      return <th key={i} className={className}></th>
    })
    const rows = this.props.matrix.get('rows').map((row, rowName) =>
      <Row key={rowName} cols={this.kind.cols} rowName={rowName} row={row} onFocus={this.onFocus} onInputValue={this.onInputValue} onBackspaceValue={this.onBackspaceValue} />
    ).valueSeq()
    return (
      <table className="table matrix">
        <thead>
          <tr>
            <td className="col0">{this.props.matrixName}</td>
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
      inputValue: (matrixName, rowName, value, negative) =>
        dispatch({ type: 'inputValue', path: [matrixName, rowName, value] }),
      backspaceValue: (matrixName, rowName) =>
        dispatch({ type: 'backspaceValue', path: [matrixName, rowName] })
    }
  }
)(Matrix)
