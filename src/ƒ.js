var Midi = {
  onPositionUpdate: () => { },
  midi: {}, // time -> midi message map
  pos: 0
};

WebMidi.enable(function (e) {

  if (e) {
    console.log(e);
    return;
  }

  const input = WebMidi.inputs[0];
  const output = WebMidi.outputs[0];
  const output_channel = 1;

  input.addListener('clock', undefined, function (e) {
    // try {
      const messages = Midi.midi[Midi.pos];
      _(messages).each(function (message) {
        if (message.on) {
          output.playNote(message.note, output_channel, { velocity: message.attack });
        } else {
          output.stopNote(message.note, output_channel, { velocity: message.release });
        }
      });
    // } catch (ex) {
      // console.log(`Failed sending MIDI message with exception: ${ex}`);
    // }
    Midi.onPositionUpdate(Midi.pos);
    Midi.pos++;
  });

  input.addListener('songposition', undefined, function (e) {
    var v = e.data[0] | (e.data[1] << 8);
    Midi.onPositionUpdate(v);
    Midi.pos = v;
  });

  input.addListener('stop', undefined, function (e) {
    Midi.onPositionUpdate(0);
    Midi.pos = 0;
  });

});

function closest(el, selector) {
  while (el) {
    if (el.matches.call(el, selector)) {
      break;
    }
    el = el.parentElement;
  }
  return el;
}

const Position = ({ currentPositionIndex }) => {
  return <span className="label label-default">{currentPositionIndex}</span>;
}

const mapStateToProps = (state) => {
  return {
    currentPositionIndex: state.currentPositionIndex
  };
}

const mapDispatchToProps = (dispatch) => {
  return {};
}

import { connect } from 'react-redux'

const PositionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Position);

const ƒApp = (state = { currentPositionIndex: 0, activeColIndex: 0 }, action) => {
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
        activeColIndex: state.activeColIndex + 1
      });
    case "decrActiveColIndex":
      return Object.assign({}, state, {
        activeColIndex: state.activeColIndex - 1
      });
    default:
      return state;
  }
}

const notActive = 'rowValue'
const active = 'rowValue activeCol'

class Value extends React.Component {
  constructor(props) {
    super(props)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }
  onMouseDown() {
    this.props.click(this.props.colIndex);
  }
  render() {
    var className = 
      (this.props.rowHasFocus && this.props.colIndex == this.props.activeCol) ?
      active : notActive 
    return (
      <div className={className} onMouseDown={this.onMouseDown} />
    );
  }
}

const ValueContainer = connect(
  state => { return { 
    activeCol: state.activeColIndex,
  }},
  dispatch => { return {
    click: (colIndex) => { dispatch({ type: 'setActiveColIndex', newActiveColIndex: colIndex })  }
  }}
)(Value)

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this)
    this.hasFocus = this.hasFocus.bind(this)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this) // no
  }
  onKeyDown(e) {
    switch (e.key) {
      case 'ArrowUp':
        var p = this.refs.el.previousSibling;
        if (!p) {
          const pMatrix = closest(this.refs.el, '.matrix').previousSibling;
          if (pMatrix) {
            const pMatrixRows = pMatrix.querySelectorAll('.matrixRow');
            if (pMatrixRows.length > 0) {
              p = pMatrixRows[pMatrixRows.length - 1];
            }
          }
        }
        if (p) {
          p.focus();
          e.preventDefault();
        }
        break;
      case 'ArrowDown':
        var p = this.refs.el.nextSibling;
        if (!p) {
          const pMatrix = closest(this.refs.el, '.matrix').nextSibling;
          if (pMatrix) {
            const pMatrixRows = pMatrix.querySelectorAll('.matrixRow');
            if (pMatrixRows.length > 0) {
              p = pMatrixRows[0];
            }
          }
        }
        if (p) {
          p.focus();
          e.preventDefault();
        }
        break;
      case 'ArrowLeft':
        this.props.left();
        break;
      case 'ArrowRight':
        this.props.right();
        break;
    }
  }
  hasFocus() {
    return this.el === document.activeElement;
  }
  render() {
    const rowValues = [...Array(24).keys()].map(i =>
      <ValueContainer key={i} colIndex={i} rowHasFocus={this.hasFocus} />
    );
    return (
      <div className="matrixRow" ref="el" tabIndex="0" onKeyDown={this.onKeyDown}>
        <div className="matrixRowName">{this.props.name}</div>
        <div className="matrixRowValues">{rowValues}</div>
      </div>
    );
  }
}

const RowContainer = connect(
  state => { return {} },
  dispatch => { return {
    left: () => dispatch({'type': 'decrActiveColIndex'}),
    right: () => dispatch({'type': 'incrActiveColIndex'})
  }}
)(Row)

var Matrix = ({ name, rows }) => {
  return (
    <div className="matrix">
      <div className="matrixHeading">{name}</div>
      <div className="matrixRowArea">{rows.map(row =>
        <RowContainer key={row} name={row} />
      )}</div>
    </div>
  );
};

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    return <div id="content">{this.props.matrixes}{this.props.children}</div>
  }
}

var matrixes = [
  <Matrix key="0scale" name="scale" rows={['value']} />,
  <Matrix key="0chord" name="chord" rows={['value']} />,
  <Matrix key="0values" name="values" rows={['duration', 'value', 'octave', 'accidental', 'attack', 'release']} />,
  <Matrix key="0values_of_scale" name="values_of_scale" rows={['duration', 'value', 'octave', 'accidental', 'attack', 'release']} />,
  <Matrix key="0values_of_chord" name="values_of_chord" rows={['duration', 'value', 'octave', 'accidental', 'attack', 'release']} />,
  <Matrix key="1scale" name="scale" rows={['value']} />,
  <Matrix key="1chord" name="chord" rows={['value']} />,
  <Matrix key="1values" name="values" rows={['duration', 'value', 'octave', 'accidental', 'attack', 'release']} />,
  <Matrix key="1values_of_scale" name="values_of_scale" rows={['duration', 'value', 'octave', 'accidental', 'attack', 'release']} />,
  <Matrix key="1values_of_chord" name="values_of_chord" rows={['duration', 'value', 'octave', 'accidental', 'attack', 'release']} />,
  <Matrix key="2scale" name="scale" rows={['value']} />,
  <Matrix key="2chord" name="chord" rows={['value']} />,
  <Matrix key="2values" name="values" rows={['duration', 'value', 'octave', 'accidental', 'attack', 'release']} />,
  <Matrix key="2values_of_scale" name="values_of_scale" rows={['duration', 'value', 'octave', 'accidental', 'attack', 'release']} />,
  <Matrix key="2values_of_chord" name="values_of_chord" rows={['duration', 'value', 'octave', 'accidental', 'attack', 'release']} />,
  <Matrix key="3scale" name="scale" rows={['value']} />,
  <Matrix key="3chord" name="chord" rows={['value']} />,
  <Matrix key="3values" name="values" rows={['duration', 'value', 'octave', 'accidental', 'attack', 'release']} />,
  <Matrix key="3values_of_scale" name="values_of_scale" rows={['duration', 'value', 'octave', 'accidental', 'attack', 'release']} />,
  <Matrix key="3values_of_chord" name="values_of_chord" rows={['duration', 'value', 'octave', 'accidental', 'attack', 'release']} />,
];

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import PureRenderMixin from 'react-addons-pure-render-mixin';

const store = createStore(ƒApp)

Midi.onPositionUpdate = positionIndex => { 
  store.dispatch({ type: 'setPositionIndex', newPositionIndex: positionIndex }); 
};

var ReactDOM = require('react-dom');

const content = ReactDOM.render(
  <Provider store={store}>
    <Content matrixes={matrixes}>
      <PositionContainer />
    </Content>
  </Provider>,
  document.getElementById('ƒ')
);
