import _ from "lodash";
import reglFactory from "regl";
import fsh from "./fragment.glsl";
import vsh from "./vertex.glsl";

function renderArena(canvas, gameState) {
  let { width, height } = canvas.getBoundingClientRect();

  const regl = reglFactory({
    pixelRatio: 2.0,
    canvas: canvas
  });

  const pixels = regl.texture();

  const orbStates = () => {
    let orbs = _.range(2).map(i => {
      return {
        [`orbs[${i}]`]: ({ pixelRatio, viewportWidth, viewportHeight }) => [
          gameState().dots[i].x,
          gameState().dots[i].y,
          0
        ]
      };
    });
    return Object.assign({}, ...orbs);
  };

  let uniforms = {
    resolution: ({ framebufferWidth, framebufferHeight, pixelRatio }) => [
      framebufferWidth,
      framebufferHeight
    ],
    texture: pixels,
    t: ({ tick }) => 0.01 * tick,
    health: () => gameState().health,
    ...orbStates()
  };

  const drawFeedback = regl({
    frag: fsh,
    vert: vsh,

    attributes: {
      position: [-2, 0, 0, -2, 2, 2]
    },
    uniforms,
    count: 3
  });

  regl.frame(function(context) {
    regl.clear({
      color: [0, 0, 0, 1]
    });
    drawFeedback();

    pixels({
      copy: true
    });
  });
}

export { renderArena };
