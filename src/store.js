import { createStore } from 'redux'

const defaultState = {
  currentPositionIndex: 0,
  activeMatrix: null,
  activeRow: null,
  activeColIndex: 0,
  matrixes: {}
}

const stateMachine = (state = defaultState, action) => {
  switch (action.type) {
    case "setPositionIndex":
      return Object.assign({}, state, {
        currentPositionIndex: action.newPositionIndex
      });
    case "setActiveColIndex":
      return Object.assign({}, state, {
        activeColIndex: action.newActiveColIndex
      });
    case "incrActiveColIndex":
      return Object.assign({}, state, {
        activeColIndex: Math.min(state.activeColIndex + 1, 23)
      });
    case "decrActiveColIndex":
      return Object.assign({}, state, {
        activeColIndex: Math.max(state.activeColIndex - 1, 0)
      });
    case "setActiveRow":
      return Object.assign({}, state, {
        activeMatrix: action.path[0],
        activeRow: action.path[1]
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
  matrixes: {
    "scale": { rows: {
      "value": { }
    }},
    "value of scale": { rows: {
      "duration": { },
      "value": { },
      "octave": { },
      "accidental": { },
      "attack": { },
      "release": { },
    }},
    "chord": { rows: {
      "value": { }
    }},
    "value of chord": { rows: {
      "duration": { },
      "value": { },
      "octave": { },
      "accidental": { },
      "attack": { },
      "release": { },
    }},
  }
}

export default createStore(stateMachine, loadedState)
