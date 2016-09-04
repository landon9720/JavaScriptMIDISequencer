import Immutable from 'immutable'

const Midi = {
  onPositionUpdate: () => { },
  midi: Immutable.Map(), // maps time to set of messages
};

var pos = 0

export default Midi;

const WebMidi = require('webmidi')

WebMidi.enable(function (e) {

  if (e) {
    console.log(e);
    return;
  }

  const input = WebMidi.inputs[0];
  const output = WebMidi.outputs[0];

  input.addListener('clock', undefined, e => {
    pos++
    try {
      const messages = Midi.midi.get(pos);
      if (messages) {
        messages.forEach(function (message) {
          if (message.on) {
            output.playNote(message.note, message.output_channel, { velocity: message.velocity });
          } else {
            output.stopNote(message.note, message.output_channel, { velocity: message.velocity });
          }
        })
      }
    } catch (ex) {
      console.error("Failed sending MIDI message with exception", ex)
    }
    Midi.onPositionUpdate(pos)
  });

  input.addListener('songposition', undefined, function (e) {
    var v = e.data[0] | (e.data[1] << 8);
    Midi.onPositionUpdate(v);
    pos = v;
  });

  input.addListener('start', undefined, function (e) {
    Midi.onPositionUpdate(0);
    pos = 0;
  });

  input.addListener('stop', undefined, function (e) {
    Midi.onPositionUpdate(0);
    pos = 0;
  });

  input.addListener('reset', undefined, function (e) {
  });

  input.addListener('continue', undefined, function (e) {
  });

});
