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
    switch (true) {
      case (e.key === 'ArrowUp'):
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
      case (e.key === 'ArrowDown'):
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
        break
      case (e.key === 'ArrowLeft'):
        this.props.left()
        break
      case (e.key === 'ArrowRight'):
        this.props.right()
        break
      case ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90)):
        if (!e.altKey && !e.ctrlKey && !e.metaKey) {
          var value = e.keyCode >= 65 ? e.keyCode - 55 : e.keyCode - 48
          if (e.shiftKey) value *= -1
          this.props.onInputValue(this.props.rowName, value)
          this.props.right()
        }
        break
      case (e.keyCode == 32):
        this.props.onInputValue(this.props.rowName, undefined)
        this.props.right()
        break
      case (e.keyCode == 8):
        if (this.props.activeColIndex > 0) {
          this.props.onBackspaceValue(this.props.rowName)
          this.props.left()
        }
        break
      default:
        console.log(`key? key='${e.key}' keyCode=${e.keyCode}`)
    }
  }
  hasFocus() {
    return this.el === document.activeElement;
  }
  onFocus() {
    this.props.onFocus(this.props.rowName)
  } 
  render() {
    const rowValues = [...Array(24).keys()].map(i => {
      var v = this.props.row.get(i)
      if (v !== undefined) v = v.toString(36)
      return <Value key={i} colIndex={i} rowHasFocus={this.hasFocus} value={v} />
    })
    return (
      <div className="matrixRow" ref="el" tabIndex="0" onKeyDown={this.onKeyDown} onFocus={this.onFocus}>
        <div className="matrixRowName">{this.props.rowName}</div>
        <div className="matrixRowValues">{rowValues}</div>
      </div>
    );
  }
}

export default connect(
  state => { return { 
    activeColIndex: state.activeColIndex 
  }},
  dispatch => { return {
    left: () => dispatch({'type': 'decrActiveColIndex'}),
    right: () => dispatch({'type': 'incrActiveColIndex'})
  }}
)(Row)
