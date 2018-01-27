const _ = require("lodash");
const regl = require("regl")({
  pixelRatio: 0.7
});
const mouse = require("mouse-change")();
const { stickState, gameState, healthState } = require("./input");
var fsh = require("./fragment.glsl");
var vsh = require("./vertex.glsl");

const pixels = regl.texture();

const orbStates = () => {
  let orbs = _.range(2).map(i => {
    return {
      [`orbs[${i}]`]: ({ pixelRatio, viewportWidth, viewportHeight }) => [
        gameState()[i].x,
        gameState()[i].y,
        0
      ]
    };
  });
  return Object.assign({}, ...orbs);
};

let uniforms = Object.assign(
  {
    resolution: context => [context.viewportWidth, context.viewportHeight],
    texture: pixels,
    mouse: ({ pixelRatio, viewportHeight }) => [
      mouse.x * pixelRatio,
      viewportHeight - mouse.y * pixelRatio
    ],
    t: ({ tick }) => 0.01 * tick,
    health: ()=>healthState()[0]
  },
  orbStates()
);

const drawFeedback = regl({
  frag: fsh,
  vert: vsh,

  attributes: {
    position: [-2, 0, 0, -2, 2, 2]
  },
  uniforms,
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
