import _ from "lodash";
import Tone from "tone";

import { setupOverlay } from "regl-shader-error-overlay";
setupOverlay();

import { getArenaState } from "./logic";
import { renderArena } from "./render";

import input from "./input";
input();

let canvases = [document.getElementById("l"), document.getElementById("r")];

canvases.forEach((c, i) => {
  renderArena(c, () => getArenaState(i), i == 0);
  window.addEventListener("resize", () => resize(c), false);
  window.addEventListener("load", () => resize(c), false);
});

function resize(canvas) {
  var bounds = canvas.getBoundingClientRect();
  var w = bounds.width;
  var h = bounds.height;

  canvas.width = 1.0 * w;
  canvas.height = 1.0 * h;
}

//create a synth and connect it to the master output (your speakers)
// var synth = ;
window.synths = [new Tone.Synth().toMaster(), new Tone.Synth().toMaster()];
//play a middle 'C' for the duration of an 8th note
window.synths.map(s => s.triggerAttack("C4"));
window.synths.map(s => (s.oscillator.frequency.value = 0));
