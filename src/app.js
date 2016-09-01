// process.env.NODE_ENV = 'production'

window.$ = window.jQuery = require('jquery')
window._ = require('lodash')
require('bootstrap')

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store.js'
import MatrixContainer from './matrix_container.js'
import MonadContainer from './monad.js'
import Midi from './midi.js'
import Panel from './panel.js'
import Tools from './tools.js'

Midi.onPositionUpdate = positionIndex => {
  store.dispatch({ type: 'setPositionIndex', newPositionIndex: positionIndex })
}

const content = render(
  <Provider store={store}>
    <div>
      <MatrixContainer />
      <Tools />
      <MonadContainer />
    </div>
  </Provider>,
  document.getElementById('container')
)
