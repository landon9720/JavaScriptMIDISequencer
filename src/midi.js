import Immutable from 'immutable'

const Midi = {
  onPositionUpdate: () => { },
  midi: Immutable.Map(), // maps time to set of messages
  pos: 0
};

export default Midi;

const WebMidi = require('webmidi')

WebMidi.enable(function (e) {

  if (e) {
    console.log(e);
    return;
  }

  const input = WebMidi.inputs[0];
  const output = WebMidi.outputs[0];

  input.addListener('clock', undefined, function (e) {
    Midi.pos++
    try {
      const messages = Midi.midi.get(Midi.pos);
      if (messages) {
        messages.forEach(function (message) {
          if (message.on) {
            console.log("playNote", message)
            output.playNote(message.note, message.output_channel, { velocity: message.velocity });
          } else {
            console.log("stopNote", message)
            output.stopNote(message.note, message.output_channel, { velocity: message.velocity });
          }
        })
      }
    } catch (ex) {
      console.error("Failed sending MIDI message with exception", ex)
    }
    Midi.onPositionUpdate(Midi.pos)
  });

  input.addListener('songposition', undefined, function (e) {
    var v = e.data[0] | (e.data[1] << 8);
    Midi.onPositionUpdate(v);
    Midi.pos = v;
  });

  input.addListener('stop', undefined, function (e) {
    Midi.onPositionUpdate(0);
    Midi.pos = 0;
  });

});
