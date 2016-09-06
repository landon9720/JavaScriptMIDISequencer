import React from 'react'
import { connect } from 'react-redux'
import Panel from './panel.js'
import Immutable from 'immutable'

class MonadContainer extends React.Component {
    constructor(props) {
        super(props)
        const IdentityMonad = {
            i: this.props.matrixNames.first(),
            x: { ƒ: "identity" }
        }
        this.ƒdb = Immutable.fromJS({
            identity: {
            },
            scale: {
                with: {
                    form: (x, key) => null,
                    default: () => IdentityMonad
                }
            },
            parallel: {
                monad1: {
                    form: (x, key) => null,
                    default: () => IdentityMonad
                },
                monad2: {
                    form: (x, key) => null,
                    default: () => IdentityMonad
                },
            }
        })
        this.onInputMatrixChange = this.onInputMatrixChange.bind(this)
        this.onƒChange = this.onƒChange.bind(this)
        this.onOutputMidiChannelChange = this.onOutputMidiChannelChange.bind(this)
    }
    selectMonad(path) {
        this.props.selectMonad(path)
    }
    onInputMatrixChange(e) {
        this.props.setInputMatrix(e.target.value)
    }
    onƒChange(e) {
        const ƒ = e.target.value
        const defaults = this.ƒdb.get(ƒ).map((parameter, parameterKey) => {
            return parameter.get("default")()
        }).toJS()
        this.props.setƒ(ƒ, defaults)
    }
    onOutputMidiChannelChange(e) {
        this.props.setOutputMidiChannel(e.target.value != null ? e.target.value : null)
    }
    render() {
        const activeMonad = this.props.activeMonad
        const monadForm = activeMonad ? (function () {
            const activeX = this.props.activeX
            const parameters = activeX ?
                <div className="form-group">
                    {this.ƒdb.get(activeX.get('ƒ')).map((parameter, parameterKey) => {
                        return parameter.get('form')(activeX.get(parameterKey), parameterKey)
                    }).valueSeq() }
                </div> : null
            return <div className="form">
                <div className="form-group">
                    <label>in</label>
                    <select className="form-control" value={activeMonad.get("i") } onChange={this.onInputMatrixChange}>
                        <option key={null} value={null}>ƒ</option>
                        {this.props.matrixNames.map(matrixName =>
                            <option key={matrixName} value={matrixName}>{matrixName}</option>
                        ).valueSeq() }
                    </select>
                </div>
                <div className="form-group">
                    <label>ƒ</label>
                    <select className="form-control" value={activeX.get('ƒ') } onChange={this.onƒChange}>
                        {this.ƒdb.map((ƒ, ƒKey) => {
                            return <option key={ƒKey} value={ƒKey}>{ƒKey}</option>
                        }).valueSeq() }
                    </select>
                </div>
                <div className="form-group">
                    <label>out</label>
                    <select className="form-control" value={activeMonad.get('o', 'none') } onChange={this.onOutputMidiChannelChange}>
                        <option key="none" value="none">None</option>
                        {[...Array(16).keys()].map(i => {
                            const channel = i + 1
                            return <option key={channel} value={channel}>MIDI Channel {channel}</option>
                        }) }
                    </select>
                </div>
                {parameters}
            </div>
        }).bind(this)() : null
        return (
            <Panel brand="default" className="monad">
                <div className="row">
                    <div className="col-lg-6">
                        <ul className="rootMonad">
                            {this.renderListing(this.props.rootMonad, Immutable.List()) }
                        </ul>
                    </div>
                    <div className="col-lg-6">
                        {monadForm}
                    </div>
                </div>
            </Panel>
        )
    }
    renderListingX(x, path) {
        const ƒclass = this.ƒdb.get(x.get('ƒ'))
        const children = ƒclass.map((parameter, parameterKey) => {
            return this.renderListing(x.get(parameterKey), path.push(parameterKey))
        }).valueSeq()
        return <ul key={path}>{children}</ul>
    }
    renderListing(m, path) {
        const labelClassName = path.equals(this.props.activeMonadPath) ?
            "text-danger" : ""
        const label = <a className={labelClassName} onClick={this.props.selectMonad.bind(this, path) }>{m.get("i", "ƒ") }</a>
        const children = m.has("x") ? this.renderListingX(m.get("x"), path.push("x")) : null
        return <li key={path}>{label}{children}</li>
    }
}

export default connect(
    store => {
        const activeMonadPath = store.activeMonadPath
        const matrixNames = store.matrixes.keySeq()
        const activeMonad = activeMonadPath ? store.monad.getIn(activeMonadPath) : null
        return {
            matrixNames: matrixNames,
            rootMonad: store.monad,
            activeMonad: activeMonad,
            activeX: activeMonad ? activeMonad.get('x') : null,
            activeMonadPath: activeMonadPath
        }
    },
    dispatch => {
        return {
            selectMonad: monadPath => dispatch({ type: "selectMonad", monadPath: monadPath }),
            setInputMatrix: matrixName => dispatch({ type: "setInputMatrix", matrixName: matrixName }),
            setƒ: (ƒ, defaults) => dispatch({ type: "setƒ", ƒ: ƒ, defaults: defaults }),
            setOutputMidiChannel: outputMidiChannel => dispatch({ type: "setOutputMidiChannel", outputMidiChannel: outputMidiChannel })
        }
    }
)(MonadContainer)
