const _ = require("lodash");
const regl = require("regl")({
  pixelRatio: 0.7
});
const mouse = require("mouse-change")();

var fsh = require("./fragment.glsl");
var vsh = require("./vertex.glsl");

const pixels = regl.texture();

const orbStates = ({ pixelRatio, viewportWidth, viewportHeight }) => {
  _.range(4).map(i => {
    return {
      [`orbs[${i}]`]: [[i*0.5, i*0.25, 0]]
    };
  });
  return {};
};
const drawFeedback = regl({
  frag: fsh,
  vert: vsh,
  attributes: {
    position: [-2, 0, 0, -2, 2, 2]
  },

  uniforms: {
    resolution: context => [context.viewportWidth, context.viewportHeight],
    texture: pixels,
    mouse: ({ pixelRatio, viewportHeight }) => [
      mouse.x * pixelRatio,
      viewportHeight - mouse.y * pixelRatio
    ],
    "orbs[0]": ({ pixelRatio, viewportWidth, viewportHeight }) => [
      mouse.y / viewportHeight * pixelRatio,
      1.0 - mouse.x / viewportWidth * pixelRatio,
      0,
      1
    ],
    "orbs[1]": ({ pixelRatio, viewportWidth, viewportHeight }) => [
      1.0 - mouse.y / viewportHeight * pixelRatio,
      mouse.x / viewportWidth * pixelRatio,
      0,
      1
    ],
    "orbs[2]": ({ pixelRatio, viewportWidth, viewportHeight }) => [
      1.0 - mouse.x / viewportWidth * pixelRatio,
      mouse.y / viewportHeight * pixelRatio,
      0,
      1
    ],
    "orbs[3]": ({ pixelRatio, viewportWidth, viewportHeight }) => [
      mouse.x / viewportWidth * pixelRatio,
      1.0 - mouse.y / viewportHeight * pixelRatio,
      0,
      1
    ],

    t: ({ tick }) => 0.01 * tick
  },
  count: 3
});

regl.frame(function() {
  regl.clear({
    color: [0, 0, 0, 1]
  });

  drawFeedback();

  pixels({
    copy: true
  });
});
