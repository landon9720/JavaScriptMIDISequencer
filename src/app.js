// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import { remote } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import { greet } from './hello_world/hello_world'; // code authored by you in this project
import env from './env';

var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());

WebMidi.enable(function (e) {

  if (e) {
    console.log(e);
    return;
  }

  const input = WebMidi.inputs[0];
  const output = WebMidi.outputs[0];
  const output_channel = 1;

  input.addListener('clock', undefined, function (e) {
    try {
      const messages = midi[pos];
      _(messages).each(function (message) {
        if (message.on) {
          output.playNote(message.note, output_channel, { velocity: message.attack });
        } else {
          output.stopNote(message.note, output_channel, { velocity: message.release });
        }
      });
    } catch (ex) {
      console.log(`Failed sending MIDI message with exception: $ex`);
    }
    positionUpdate(pos);
    pos++;
  });
  input.addListener('songposition', undefined, function (e) {
    var v = data[0] | (data[1] << 8);
    positionUpdate(v);
    pos = v;
  });
  input.addListener('stop', undefined, function (e) {
    positionUpdate(0);
    pos = 0;
  });

  var midi = {};
  var pos = 0;
  const $pos = $('#pos');

  function positionUpdate(p) {
    $pos.text(p);
  }

});