const _ = require("lodash");

const { getArenaState } = require("./logic");
const { renderArena } = require("./render");

require("./input")();
let canvases = [document.getElementById("l"), document.getElementById("r")];

canvases.forEach((c, i) => {
  renderArena(c, ()=>getArenaState(i));
  window.addEventListener("resize", () => resize(c), false);
  window.addEventListener("load", () => resize(c), false);
});

function resize(canvas) {
  var bounds = canvas.getBoundingClientRect();
  var w = bounds.width;
  var h = bounds.height;

  canvas.width = 0.7 * w;
  canvas.height = 0.7 * h;
}
