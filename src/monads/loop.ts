import Immutable from 'immutable'
import { NullIn, SequenceOut, durationOfSequence, shiftSequence, IdentityMonad} from '../engine.js'

export default {
    name: "scale",
    in: NullIn,
    out: SequenceOut,
    ƒ: (input, parameters) => {
        const times = parameters.get('times')
        const duration = durationOfSequence(input)
        return Immutable.Range(0, times).reduce((a, i) => {
            return a.concat(shiftSequence(input, i * duration))
        }, Immutable.List())
    },
    parameters: [{
        times: {
            form: (x, key) => null,
            default: () => 8,
            type: '!m'
        }
    }]
}
