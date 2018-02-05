import cs from "computer-sleep";
import { setupOverlay } from "regl-shader-error-overlay";
setupOverlay();

import { getArenaState } from "./logic";
import { renderArena } from "./render";

import input from "./input";
import { sound } from "./sound";

sound();
input();
window.pixelRatio = 0.9;

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

  canvas.width = window.pixelRatio * w;
  canvas.height = window.pixelRatio * h;
}

cs.prevent();
