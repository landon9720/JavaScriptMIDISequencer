import Immutable from 'immutable'
import Midi from './midi.js'

export default function (state) {
    const matrixes = state.matrixes
    const rootMonad = state.monad
    const ƒdb = {
        identity: (input, parameters) => { return input },
        scale: (input, parameters) => { return input }
    }
    const apply = monad => {
        const inputMatrixName = monad.get('i')
        const matrix = matrixes.get(inputMatrixName)
        const sequence = matrixToSequence(matrix)
        const ƒParams = monad.get('x')
        const ƒKey = ƒParams.get('ƒ')
        const resultSequence = ƒdb[ƒKey](sequence, ƒParams)
        return resultSequence
    }
    const sequence = apply(rootMonad)
    const midi = sequenceToMidi(sequence)
    Midi.midi = midi
}

const matrixToSequence = matrix => {
    const matrixValues = matrix.get('rows').get('value').entrySeq()
    const sequence = matrixValues.flatMap(([k, {v, negative}]) => {
        const charCode = v.toUpperCase().charCodeAt(0)
        var value = (charCode >= 65 ? charCode - 55 : charCode - 48) * (negative ? -1 : 1)
        const duration = 1
        return Immutable.List([{
            t: k,
            value: value,
            duration: duration
        }])
    })
    console.log("sequence", sequence.toJS())
    return sequence
}

const midiRoot = 60

const sequenceToMidi = sequence => {
    const midi = sequence.reduce((accumulator, event) => {
        const start = event.t + 1
        const end = start + event.duration
        var a = accumulator
        var startMessages = accumulator.get(start, Immutable.Set())
        var endMessages = accumulator.get(end, Immutable.Set())
        startMessages = startMessages.add({
            on: true,
            output_channel: 1,
            note: midiRoot + event.value,
            velocity: 100
        })
        endMessages = endMessages.add({
            on: false,
            output_channel: 1,
            note: midiRoot + event.value,
            velocity: 100
        })
        a = a.set(start, startMessages)
        a = a.set(end, endMessages)
        return a
    }, Immutable.Map())
    console.log("midi", midi.toJS())
    return midi
}
