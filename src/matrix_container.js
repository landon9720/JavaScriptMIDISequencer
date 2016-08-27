import React from 'react'
import { connect } from 'react-redux'

import Matrix from './matrix.js'

class MatrixContainer extends React.Component {
  render() {
    var matrixes = Object.keys(this.props.matrixes).map(matrixName =>
      <Matrix key={matrixName} matrixName={matrixName} matrix={this.props.matrixes[matrixName]} />
    )
    return (
      <div id="matrixContainer">
        {matrixes}
      </div>
    )
  }
}

export default connect(
  (store) => { return { matrixes: store.matrixes } },
  (dispatch) => { return { setActiveMatrixIndex: (i) => dispatch({ setActiveMatrixIndex: i }) } }
)(MatrixContainer)
