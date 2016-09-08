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
  matrixes: Immutable.OrderedMap(),
  monad: Immutable.Map(),
  activeMonadPath: null
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
        activeMonadPath: null
      })
    case "selectMonad":
      return Object.assign({}, state, {
        activeMonadPath: action.monadPath
      })
    case "setInputMatrix":
      return Object.assign({}, state, {
        monad: action.matrixName ? 
          state.monad.setIn(state.activeMonadPath.push('i'), action.matrixName) :
          state.monad.deleteIn(state.activeMonadPath.push('i'))
      })
    case "setƒ":
      const xPath = state.activeMonadPath.push("x")
      const existingX = state.monad.getIn(xPath)
      const newX = Object.assign({}, action.defaults, existingX, { ƒ: action.ƒ })
      return Object.assign({}, state, { monad: state.monad.mergeDeepIn(xPath, newX) })
    case "setOutputMidiChannel":
      return Object.assign({}, state, {
        monad: action.outputMidiChannel ?
          state.monad.setIn(state.activeMonadPath.push('o'), action.outputMidiChannel) :
          state.monad.deleteIn(state.activeMonadPath.push('o'))
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
    major: Immutable.OrderedMap({
      rows: Immutable.OrderedMap({
        value: Immutable.Map()
      })
    }),
    notes_of_scale: Immutable.OrderedMap({
      rows: Immutable.OrderedMap({
        value: Immutable.Map(),
        duration: Immutable.Map()
      })
    }),
    chromatic_notes: Immutable.OrderedMap({
      rows: Immutable.OrderedMap({
        value: Immutable.Map(),
        duration: Immutable.Map()
      })
    }),
  }),
  monad: Immutable.fromJS({
    x: {
      ƒ: "parallel",
      monad1: { i: "notes_of_scale", x: { ƒ: "scale", with: { i: "major", x: { ƒ: "identity" } } }, o: 1 },
      monad2: { i: "chromatic_notes", x: { ƒ: "identity" }, o: 2 }
    }
  }),
  activeMonadPath: null
}

const store = createStore(
  stateMachine,
  loadedState,
  applyMiddleware(thunk, promise,
    createLogger(
      {
        collapsed: true,
        actionTransformer: action => Immutable.fromJS(action).toJS(),
        stateTransformer: state => Immutable.fromJS(state).toJS()
      }
    )
  )
)

export default store