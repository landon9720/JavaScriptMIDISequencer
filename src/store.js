import { createStore } from 'redux'
import Immutable from 'immutable'
import { applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import promise from 'redux-promise'
import createLogger from 'redux-logger'

export const MatrixKindNotes = {
  cols: 24
} // a type
export const MatrixKindScale = {
  cols: 12
} // a type
export const MatrixKindMonad = {
  cols: 6
} // a type

export const stringToKind = s => {
  if (s == 'notes') return MatrixKindNotes
  if (s == 'scale') return MatrixKindScale
  if (s == 'monad') return MatrixKindMonad
  throw s
}

// String.prototype.stringToKind = stringToKind

const defaultState = {
  currentPositionIndex: 0,
  activeMatrix: null,
  activeRow: null,
  activeColIndex: 0,
  cursorMode: 0,
  matrixes: Immutable.OrderedMap(),
}

const stateMachine = (state = defaultState, action) => {
  const kind = state.activeMatrix ?
    stringToKind(state.matrixes.get(state.activeMatrix).get('kind')) :
    null
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
        activeColIndex: Math.min(state.activeColIndex + 1, kind.cols - 1)
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
        const m = action.path[0]
        const r = action.path[1]
        var i = state.activeColIndex
        if (state.activeMatrix && m && state.activeMatrix != m) {
          const cols = stringToKind(state.matrixes.get(m).get('kind')).cols
          if (cols != kind.cols) {
            const ratio = cols / kind.cols 
            i = Math.floor(i * ratio)
          }
        }
        return Object.assign({}, state, {
          activeMatrix: m,
          activeRow: r,
          activeColIndex: i
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
        matrix = novalue ?
          matrix.deleteIn(["rows", rowName, state.activeColIndex]) :
          matrix.setIn(["rows", rowName, state.activeColIndex], value)
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
    case "unselectAll":
      return Object.assign({}, state, {
        activeMatrix: null,
        activeRow: null,
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
  cursorMode: 0,
  matrixes: Immutable.OrderedMap({
    chromatic_notes: Immutable.OrderedMap({
      kind: 'notes',
      rows: Immutable.OrderedMap({
        value: Immutable.Map(),
        octave: Immutable.Map(),
        accidental: Immutable.Map(),
        duration: Immutable.Map()
      })
    }),
    notes_of_scale: Immutable.OrderedMap({
      kind: 'notes',
      rows: Immutable.OrderedMap({
        value: Immutable.Map(),
        octave: Immutable.Map(),
        accidental: Immutable.Map(),
        duration: Immutable.Map()
      })
    }),
    major: Immutable.OrderedMap({
      kind: 'scale',
      rows: Immutable.OrderedMap({
        value: Immutable.Map()
      })
    }),
    monads: Immutable.OrderedMap({
      kind: 'monad',
      rows: Immutable.OrderedMap({
        I: Immutable.Map(),
        II: Immutable.Map(),
        III: Immutable.Map(),
        IV: Immutable.Map()
      })
    }),
  }),
}

export default createStore(
  stateMachine,
  loadedState,
  // applyMiddleware(thunk, promise,
  //   createLogger(
  //     {
  //       collapsed: true,
  //       actionTransformer: action => Immutable.fromJS(action).toJS(),
  //       stateTransformer: state => Immutable.fromJS(state).toJS()
  //     }
  //   )
  // )
)

