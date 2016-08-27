import React from 'react'
import { connect } from 'react-redux'

import Row from './row.js'

class Matrix extends React.Component {
  constructor(props) {
    super(props)
    this.onFocus = this.onFocus.bind(this)
  }
  onFocus(rowName) {
    this.props.setActiveRow(this.props.matrix.name, rowName)
  }
  render() {
    return (
      <div className="matrix">
        <div className="matrixHeading">{this.props.matrixName}</div>
        <div className="matrixRowArea">{Object.keys(this.props.matrix.rows).map(rowName =>
          <Row key={rowName} rowName={rowName} row={this.props.matrix.rows[rowName]} onFocus={this.onFocus} />
        )}</div>
      </div>
    )
  }
}

export default connect(
  state => { return { } },
  dispatch => { return { setActiveRow: (matrixName, rowName) => dispatch({ type: 'setActiveRow', path: [matrixName, rowName] }) } }
)(Matrix)
