import Immutable from 'immutable'
import Midi from './midi.js'

var matrixes = null
var rootMonad = null

// computes and updates MIDI sequencer state from input state 
export default function (state) {
    matrixes = state.matrixes
    rootMonad = state.monad
    Midi.midi = Immutable.Map()
    const sequence = monadToSequence(rootMonad)
}

const monadToSequence = monad => {
    var sequence
    if (monad.has('i')) {
        const inputMatrixName = monad.get('i')
        const matrix = matrixes.get(inputMatrixName)
        sequence = matrixToSequence(matrix)
    } else {
        sequence = EmptySequence
    }
    const ƒParams = monad.get('x')
    const ƒKey = ƒParams.get('ƒ')
    const resultSequence = ƒdb[ƒKey](sequence, ƒParams)
    if (monad.has('o')) {
        const midiChannel = monad.get('o')
        const midi = sequenceToMidi(Midi.midi, resultSequence, midiChannel)
        Midi.midi = midi
    }
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
        var octave = e.octave
        while (rank < 0) {
            rank += scale.size
            octave -= 1
        }
        while (rank >= scale.size) {
            rank -= scale.size
            octave += 1
        }
        return Object.assign({}, e, { value: scale.get(rank), octave: octave })
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

const parallelƒ = (input, parameters) => {
    const monad1 = parameters.get('monad1')
    const monad2 = parameters.get('monad2')
    var result = input
    if (monad1) result = result.concat(monadToSequence(monad1))
    if (monad2) result = result.concat(monadToSequence(monad2))
    return result
}

const ƒdb = {
    identity: identityƒ,
    scale: scaleƒ,
    parallel: parallelƒ,
}

// a sequence is an immutable list of events
// an event is a t, value, octave, accidental, duration
const EmptySequence = Immutable.List()

const matrixToSequence = matrix => {
    const rows = matrix.get('rows')
    const valueRow = rows.get('value', Immutable.Map())
    const octaveRow = rows.get('octave', Immutable.Map())
    const accidentalRow = rows.get('accidental', Immutable.Map())
    const durationRow = rows.get('duration', Immutable.Map())
    const sequence = valueRow.entrySeq().flatMap(([k, value]) => {
        const octave = octaveRow.get(k, 0)
        const accidental = accidentalRow.get(k, 0)
        const duration = durationRow.get(k, 1)
        return Immutable.List([{
            t: k,
            value: value,
            octave: octave,
            accidental: accidental,
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

// midi is a map of t to the set of messages at t
const sequenceToMidi = (midiTimeMessagesMap, sequence, midiChannel) => {
    const midi = sequence.reduce((accumulator, event) => {
        const start = event.t + 1
        const end = start + event.duration
        var a = accumulator
        var startMessages = accumulator.get(start, Immutable.Set())
        var endMessages = accumulator.get(end, Immutable.Set())
        startMessages = startMessages.add({
            on: true,
            output_channel: midiChannel,
            note: midiRoot + event.octave * 12 + event.value + event.accidental,
            velocity: 100
        })
        endMessages = endMessages.add({
            on: false,
            output_channel: midiChannel,
            note: midiRoot + event.octave * 12 + event.value,
            velocity: 100
        })
        a = a.set(start, startMessages)
        a = a.set(end, endMessages)
        return a
    }, midiTimeMessagesMap)
    console.log("midi", midi.toJS())
    return midi
}
