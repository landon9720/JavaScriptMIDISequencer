// process.env.NODE_ENV = 'production'

window.$ = window.jQuery = require('jquery')
require('bootstrap')
import React from 'react'
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store.js'
import MatrixContainer from './matrix_container.js'
import Midi from './midi.js'
import Panel from './panel.js'
import Tools from './tools.js'

Midi.onPositionUpdate = positionIndex => {
  store.dispatch({ type: 'setPositionIndex', newPositionIndex: positionIndex - 1 })
}

store.subscribe(() => {
      // engage(store.getState())
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
      <Tools />
    </App>
  </Provider>,
  document.getElementById('container')
)
