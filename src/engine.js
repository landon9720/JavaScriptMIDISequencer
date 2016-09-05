import Immutable from 'immutable'
import Midi from './midi.js'

var matrixes = null
var rootMonad = null

// computes and updates MIDI sequencer state from input state 
export default function (state) {
    matrixes = state.matrixes
    rootMonad = state.monad
    const sequence = monadToSequence(rootMonad)
    const midi = sequenceToMidi(sequence)
    Midi.midi = midi
}

const monadToSequence = monad => {
    const inputMatrixName = monad.get('i')
    const matrix = matrixes.get(inputMatrixName)
    const sequence = matrixToSequence(matrix)
    const ƒParams = monad.get('x')
    const ƒKey = ƒParams.get('ƒ')
    const resultSequence = ƒdb[ƒKey](sequence, ƒParams)
    return resultSequence
}

// a scale is an immutable list of ON ranks
const sequenceToScale = sequence => {
    const indexedSequence = indexSequence(sequence)
    const maskLength = Immutable.Range().takeWhile(t => {
        const eventsAt_t = indexedSequence.get(t, Immutable.List())
        return eventsAt_t.some(e => e.value == 0 || e.value == 1)
    }).cacheResult().size
    console.log("maskLength", maskLength)
    if (maskLength == 0) {
        return undefined
    }
    const mask = Immutable.Range(0, maskLength).map(t => {
        const eventsAt_t = indexedSequence.get(t, Immutable.List())
        return [t, eventsAt_t.some(e => e.value == 1)]
    }).cacheResult()
    console.log("mask", mask.toJS())
    const scale = mask.filter(([t, v]) => v).map(([t, v]) => t).cacheResult()
    if (scale.size == 0) {
        return undefined
    }
    console.log("scale", scale.toJS())
    return scale.toList()
}

const applyScaleToSequence = (sequence, scale) => {
    return sequence.map(e => {
        var rank = e.value
        // var octave = value.octave
        while (rank < 0) {
            rank += scale.size
            // octave -= 1
        }
        while (rank >= scale.size) {
            rank -= scale.size
            // octave += 1
        }
        return Object.assign({}, e, { value: scale.get(rank) })
    })
}

const identityƒ = (input, parameters) => {
    return input
}

const scaleƒ = (input, parameters) => {
    const withMonad = parameters.get('with')
    const sequence = monadToSequence(withMonad)
    const scale = sequenceToScale(sequence)
    if (scale == undefined) {
        console.warn("empty scale", withMonad)
        return EmptySequence
    }
    const result = applyScaleToSequence(input, scale)
    return result
}

const ƒdb = {
    identity: identityƒ,
    scale: scaleƒ
}

// a sequence is an immutable list of events
// an event is a t, value, duration
const EmptySequence = Immutable.List()

const matrixToSequence = matrix => {
    const rows = matrix.get('rows')
    const valueRow = rows.get('value', Immutable.Map())
    const durationRow = rows.get('duration', Immutable.Map())
    const sequence = valueRow.entrySeq().flatMap(([k, value]) => {
        const duration = durationRow.get(k, 1)
        return Immutable.List([{
            t: k,
            value: value,
            duration: duration
        }])
    })
    console.log("matrixToSequence", sequence.toJS())
    return sequence
}

const indexSequence = sequence => {
    return sequence.groupBy(e => { return e.t })
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
