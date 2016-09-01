import React from 'react'
import { connect } from 'react-redux'
import Panel from './panel.js'

class Monad extends React.Component {
    render() {
        const m = this.props.isRoot ? this.props.root : this.props.monad.monad
        const matrixOrMonad = m ?
            <ConnectedMonad monad={m} /> :
            <select className="form-control">
                {this.props.matrixNames.map(matrixName =>
                    <option key={matrixName}>{matrixName}</option>
                ) }
            </select>
        return (
            <Panel className="monad" title="Monad">
                <div className="form-inline">
                    {matrixOrMonad}
                    <button type="button" className="btn btn-default">Box</button>
                    <button type="button" className="btn btn-default">Unbox</button>
                </div>
            </Panel>
        )
    }
}

const ConnectedMonad = connect(
    store => {
        return {
            matrixNames: store.matrixes.keySeq(),
            root: store.monad
        }
    },
    dispatch => {
        return {

        }
    }
)(Monad)

class MonadContainer extends React.Component {
    render() {
        return <div/>
    }
}

export default connect(
    store => {
        return {
        }
    },
    dispatch => {
        return {
        }
    }
)(MonadContainer)
