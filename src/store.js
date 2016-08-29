import { createStore } from 'redux'
import Immutable from 'immutable'
import { applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import promise from 'redux-promise'
import createLogger from 'redux-logger'

const defaultState = {
  currentPositionIndex: 0,
  activeMatrix: null,
  activeRow: null,
  activeColIndex: 0,
  insertCursorMode: false,
  matrixes: Immutable.OrderedMap({})
}

const stateMachine = (state = defaultState, action) => {
  switch (action.type) {
    case "setPositionIndex":
      return Object.assign({}, state, {
        currentPositionIndex: action.newPositionIndex
      })
    case "setActiveColIndex":
      return Object.assign({}, state, {
        activeColIndex: action.newActiveColIndex
      })
    case "incrActiveColIndex":
      return Object.assign({}, state, {
        activeColIndex: Math.min(state.activeColIndex + 1, 23)
      })
    case "decrActiveColIndex":
      return Object.assign({}, state, {
        activeColIndex: Math.max(state.activeColIndex - 1, 0)
      })
    case "setInsertCursorMode":
      return Object.assign({}, state, {
        insertCursorMode: action.b
      })
    case "setActiveRow":
      var [matrixName, rowName] = action.path
      return Object.assign({}, state, {
        activeMatrix: matrixName,
        activeRow: rowName
      })
    case "setValue":
      var [matrixName, rowName, value] = action.path
      const x = state.activeColIndex
      const updated = value !== undefined ? 
        state.matrixes.setIn([matrixName, "rows", rowName, x], value) :
        state.matrixes.deleteIn([matrixName, "rows", rowName, x])
      return Object.assign({}, state, {
        matrixes: updated
      })
    default:
      return state
  }
}

const loadedState = {
  currentPositionIndex: 0,
  activeMatrix: null,
  activeRow: null,
  activeColIndex: 0,
  insertCursorMode: false,
  matrixes: Immutable.OrderedMap({
    scale: Immutable.OrderedMap({
      rows: Immutable.OrderedMap({
        value: Immutable.Map()
      })
    }),
    notes_of_scale: Immutable.OrderedMap({
      rows: Immutable.OrderedMap({
        duration: Immutable.Map(),
        value: Immutable.Map()
      })
    }),
  })
}

export default createStore(
  stateMachine, 
  loadedState, 
  applyMiddleware(thunk, promise, createLogger({ 
    collapsed: true,
    stateTransformer: state => Object.assign({}, state, { 
      matrixes: state.matrixes.toJS() 
    })
  }))
)
