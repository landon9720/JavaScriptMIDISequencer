const Midi = {
  onPositionUpdate: () => { },
  midi: {}, // time -> midi message map
  pos: 0
};

export default Midi;

WebMidi.enable(function (e) {

  if (e) {
    console.log(e);
    return;
  }

  const input = WebMidi.inputs[0];
  const output = WebMidi.outputs[0];
  const output_channel = 1;

  input.addListener('clock', undefined, function (e) {
    // try {
      const messages = Midi.midi[Midi.pos];
      _(messages).each(function (message) {
        if (message.on) {
          output.playNote(message.note, output_channel, { velocity: message.attack });
        } else {
          output.stopNote(message.note, output_channel, { velocity: message.release });
        }
      });
    // } catch (ex) {
      // console.log(`Failed sending MIDI message with exception: ${ex}`);
    // }
    Midi.onPositionUpdate(Midi.pos);
    Midi.pos++;
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
