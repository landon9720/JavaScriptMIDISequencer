import { monadToSequence, sequenceToScale, EmptySequence, applyScaleToSequence, IdentityMonad, NullIn, SequenceOut } from '../engine.js'

export default {
    name: "scale",
    in: NullIn,
    out: SequenceOut,
    ƒ: (input, parameters) => {
        const withMonad = parameters.get('with')
        const sequence = monadToSequence(withMonad)
        const scale = sequenceToScale(sequence)
        if (scale == undefined) {
            console.warn("empty scale", withMonad)
            return EmptySequence
        }
        const result = applyScaleToSequence(input, scale)
        return result
    },
    parameters: [{
        with: {
            form: (x, key) => null,
            default: () => IdentityMonad,
            type: 'm'
        }
    }]
}
