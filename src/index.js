import _ from "lodash";
import { setupOverlay } from "regl-shader-error-overlay";
setupOverlay();

import { getArenaState } from "./logic";
import { renderArena } from "./render";

import input from "./input";
input();

let canvases = [document.getElementById("l"), document.getElementById("r")];

canvases.forEach((c, i) => {
  renderArena(c, () => getArenaState(i));
  window.addEventListener("resize", () => resize(c), false);
  window.addEventListener("load", () => resize(c), false);
});

function resize(canvas) {
  var bounds = canvas.getBoundingClientRect();
  var w = bounds.width;
  var h = bounds.height;

  canvas.width = 2.0 * w;
  canvas.height = 2.0 * h;
}
