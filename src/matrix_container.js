import React from 'react'
import { connect } from 'react-redux'
import Matrix from './matrix.js'

class MatrixContainer extends React.Component {
  render() {
    var matrixes = this.props.matrixes.map((matrix, matrixName) =>
      <Matrix key={matrixName} matrixName={matrixName} matrix={this.props.matrixes.get(matrixName) } />
    ).valueSeq()
    return (
      <div>
        {matrixes}
      </div>
    )
  }
}

export default connect(
  (store) => { return { matrixes: store.matrixes } },
  (dispatch) => { return { setActiveMatrixIndex: (i) => dispatch({ setActiveMatrixIndex: i }) } }
)(MatrixContainer)
