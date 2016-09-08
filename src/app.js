// process.env.NODE_ENV = 'production'

window.$ = window.jQuery = require('jquery')
// window._ = require('lodash')
require('bootstrap')
// require('bootstrap-select')

import React from 'react'
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store.js'
import MatrixContainer from './matrix_container.js'
import MonadContainer from './monad.js'
import Midi from './midi.js'
import Panel from './panel.js'
import Tools from './tools.js'
import engage from './engine.js'

Midi.onPositionUpdate = positionIndex => {
  store.dispatch({ type: 'setPositionIndex', newPositionIndex: positionIndex - 1 })
}

// const waitTime = 200
// var timer = null
// var matrixes0
// var monad0
store.subscribe(() => {
  // const state = store.getState()
  // if (!state.matrixes.equals(matrixes0) || !state.monad.equals(monad0)) {
  //   matrixes0 = state.matrixes
  //   monad0 = state.monad
  //   if (timer) {
  //     return
  //   }
  //   timer = setTimeout(() => {
      engage(store.getState())
  //     timer = null
  //   }, waitTime)
  // }
})

class App_ extends React.Component {
  render() {
    return <div onMouseDown={this.props.unselectAll}>{this.props.children}</div>
  }
}

const App = connect(
  store => {
    return {

    }
  },
  dispatch => {
    return {
      unselectAll: () => dispatch({ type: "unselectAll" })
    }
  }
)(App_)

const content = render(
  <Provider store={store}>
    <App>
      <MatrixContainer />
      <MonadContainer />
      <Tools />
    </App>
  </Provider>,
  document.getElementById('container')
)
