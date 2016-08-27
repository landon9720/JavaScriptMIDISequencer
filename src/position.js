import React from 'react'
import { connect } from 'react-redux'

const Position = ({ currentPositionIndex }) => {
  return <span className="label label-default">{currentPositionIndex}</span>
}

export default connect(
  (store) => { return { currentPositionIndex: store.currentPositionIndex } },
  (dispatch) => { return { } }
)(Position)