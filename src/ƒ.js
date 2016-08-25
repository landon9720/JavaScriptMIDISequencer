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
    try {
      const messages = Midi.midi[Midi.pos];
      _(messages).each(function (message) {
        if (message.on) {
          output.playNote(message.note, output_channel, { velocity: message.attack });
        } else {
          output.stopNote(message.note, output_channel, { velocity: message.release });
        }
      });
    } catch (ex) {
      console.log(`Failed sending MIDI message with exception: ${ex}`);
    }
    Midi.onPositionUpdate(Midi.pos);
    Midi.pos++;
  });

  input.addListener('songposition', undefined, function (e) {
    var v = data[0] | (data[1] << 8);
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

const ƒApp = (state = { currentPositionIndex: 0 }, action) => {
  switch (action.type) {
    case "set":
      return {
        currentPositionIndex: action.newPositionIndex
      };
    default:
      console.log("state", state, "action", action);
      return state;
  }
}

class Value extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ' ',
      negative: false
    };
  }
  onMouseDown(e) {
    this.props.mouseDown(this.props.colIndex);
  }
  render() {
    return (
      <div className={'rowValue ' + (this.props.activeCol ? 'activeCol' : '') } onMouseDown={this.onMouseDown.bind(this)} />
    );
  }
}

class Row extends React.Component {
  constructor(props) {
    super(props);
  }
  onKeyDown(e) {
    // console.log("Row onKeyDown", e);
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
  render() {
    const rowValues = [...Array(40).keys()].map(i =>
      <Value key={i} colIndex={i} activeCol={i == this.props.activeCol} mouseDown={this.props.mouseDown} />
    );
    return (
      <div className="matrixRow" ref="el" tabIndex="0" onKeyDown={this.onKeyDown.bind(this) }>
        <div className="matrixRowName">{this.props.name}</div>
        <div className="matrixRowValues">{rowValues}</div>
      </div>
    );
  }
}

var Matrix = ({ name, rows, activeColumnIndex, left, right, mouseDown }) => {
  return (
    <div className="matrix">
      <div className="matrixHeading">{name}</div>
      <div className="matrixRowArea">{rows.map(row =>
        <Row key={row} name={row} activeCol={activeColumnIndex} left={left} right={right} mouseDown={mouseDown} />
      )}</div>
    </div>
  );
};

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeColumnIndex: 0,
      matrixes: props.matrixes
    };
  }
  onLeft() {
    this.setState({
      activeColumnIndex: this.state.activeColumnIndex - 1
    });
  }
  onRight() {
    this.setState({
      activeColumnIndex: this.state.activeColumnIndex + 1
    });
  }
  mouseDown(i) {
    this.setState({
      activeColumnIndex: i
    });
  }
  render() {
    const matrixesWithEvents = this.state.matrixes.map(i => {
      return React.cloneElement(i, {
        left: this.onLeft.bind(this),
        right: this.onRight.bind(this),
        mouseDown: this.mouseDown.bind(this),
        activeColumnIndex: this.state.activeColumnIndex,
      });
    });
    return (
      <div id="content">{matrixesWithEvents}{this.props.children}</div>
    );
  }
}

var matrixes = [
  <Matrix key="scale" name="scale" rows={['value']} />,
  <Matrix key="chord" name="chord" rows={['value']} />,
  <Matrix key="values" name="values" rows={['duration', 'value', 'octave', 'accidental', 'attack', 'release']} />,
  <Matrix key="values_of_scale" name="values_of_scale" rows={['duration', 'value', 'octave', 'accidental', 'attack', 'release']} />,
  <Matrix key="values_of_chord" name="values_of_chord" rows={['duration', 'value', 'octave', 'accidental', 'attack', 'release']} />,
];

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

const store = createStore(ƒApp)

Midi.onPositionUpdate = positionIndex => { 
  store.dispatch({ type: 'set', newPositionIndex: positionIndex }); 
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
