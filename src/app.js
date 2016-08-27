process.env.NODE_ENV = 'production';

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store.js'
import Position from './position.js'
import MatrixContainer from './matrix_container.js'
import Midi from './midi.js'

Midi.onPositionUpdate = positionIndex => { 
  store.dispatch({ type: 'setPositionIndex', newPositionIndex: positionIndex }); 
};

const content = render(
  <Provider store={store}>
    <div>
      <MatrixContainer />
      <Position />
    </div>
  </Provider>,
  document.getElementById('container')
);