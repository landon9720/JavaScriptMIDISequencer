import React from 'react'
import { connect } from 'react-redux'

import { closest } from './util.js'
import Value from './value.js'

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this)
    this.hasFocus = this.hasFocus.bind(this)
    this.onFocus = this.onFocus.bind(this)
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
  onFocus() {
    this.props.onFocus(this.props.name)
  }
  render() {
    const rowValues = [...Array(24).keys()].map(i =>
      <Value key={i} colIndex={i} rowHasFocus={this.hasFocus} />
    )
    return (
      <div className="matrixRow" ref="el" tabIndex="0" onKeyDown={this.onKeyDown} onFocus={this.onFocus}>
        <div className="matrixRowName">{this.props.rowName}</div>
        <div className="matrixRowValues">{rowValues}</div>
      </div>
    );
  }
}

export default connect(
  state => { return { } },
  dispatch => { return {
    left: () => dispatch({'type': 'decrActiveColIndex'}),
    right: () => dispatch({'type': 'incrActiveColIndex'})
  }}
)(Row)
