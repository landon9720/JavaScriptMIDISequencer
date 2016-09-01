import React from 'react'
import { connect } from 'react-redux'
import Matrix from './matrix.js'
import Panel from './panel.js'

class MatrixContainer extends React.Component {
  render() {
    var matrixes = this.props.matrixes.map((matrix, matrixName) => {
      return (
        <Panel key={matrixName} title={matrixName} className="matrix" brand="primary">
          <Matrix matrixName={matrixName} matrix={this.props.matrixes.get(matrixName)} />
        </Panel>
      )
    }).valueSeq()
    return (
      <div>
        {matrixes}
      </div>
    )
  }
}

export default connect(
  (store) => { return { matrixes: store.matrixes, activeMatrix: store.activeMatrix } },
  (dispatch) => { return { setActiveMatrixIndex: (i) => dispatch({ setActiveMatrixIndex: i }) } }
)(MatrixContainer)
