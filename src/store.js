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
  cursorMode: 0,
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
    case "setCursorMode":
      return Object.assign({}, state, {
        cursorMode: action.value
      })
    case "setActiveRow":
      return (function () {
        const matrixName = action.path[0]
        const rowName = action.path[1]
        return Object.assign({}, state, {
          activeMatrix: matrixName,
          activeRow: rowName
        })
      })()
    case "inputValue":
      return (function () {
        const matrixName = action.path[0]
        const rowName = action.path[1]
        const value = action.path[2]
        const novalue = value === undefined
        var matrix = state.matrixes.get(matrixName)
        if (state.cursorMode > 0) {
          let shiftedRows = matrix.get('rows').mapEntries(([rn, row]) => {
            return [rn, row.mapEntries(([t, value]) => {
              if (t < state.activeColIndex || (state.cursorMode == 1 && rn != rowName))
                return [t, value]
              else
                return [t + 1, value]
            })]
          })
          matrix = matrix.set('rows', shiftedRows)
        }
        matrix = matrix.setIn(["rows", rowName, state.activeColIndex], value)
        return Object.assign({}, state, {
          matrixes: state.matrixes.set(matrixName, matrix)
        })
      })()
    case "backspaceValue":
      return (function () {
        const matrixName = action.path[0]
        const rowName = action.path[1]
        var matrix = state.matrixes.get(matrixName)
        matrix = matrix.deleteIn(["rows", rowName, state.activeColIndex - 1])
        if (state.cursorMode > 0) {
          let shiftedRows = matrix.get('rows').mapEntries(([rn, row]) => {
            return [rn, row.mapEntries(([t, value]) => {
              if (t < state.activeColIndex || (state.cursorMode == 1 && rn != rowName))
                return [t, value]
              else
                return [t - 1, value]
            })]
          })
          matrix = matrix.set('rows', shiftedRows)
        }
        return Object.assign({}, state, {
          matrixes: state.matrixes.set(matrixName, matrix)
        })
      })()
    default:
      return state
  }
}

const loadedState = {
  currentPositionIndex: 0,
  activeMatrix: null,
  activeRow: null,
  activeColIndex: 0,
  cursorMode: 0,
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
