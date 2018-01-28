const _ = require("lodash");

let clamp = (v, d = 1) => Math.min(Math.max(v, -d), d);
let friction = v => (Math.abs(v) < 0.3 ? 0 : v);
let distance = ({ x, y }, { x: bx, y: by }) =>
  Math.sqrt(Math.pow(x - bx, 2) + Math.pow(y - by, 2));

let speed = 5 / 100;

let add = ({ x, y }, { x: bx, y: by }) => {
  return {
    x: clamp(x + bx),
    y: clamp(y + by)
  };
};

function updateDot({ x, y }, { x: dx, y: dy }) {
  return {
    x: clamp(x + friction(dx) * speed, 0.8),
    y: clamp(y + friction(dy) * -speed, 0.8)
  };
}

let makeArena = () => {
  return {
    dots: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
    AI: { x: 0, y: 0 },
    health: 1
  };
};
let arenas = [makeArena(), makeArena()];

let set = v => Object.assign(state, v);

function updateArena({ stick, dots, AI, health }, input) {
  let rand = {
    x: (Math.random() - 0.5) * 2.0,
    y: (Math.random() - 0.5) * 2.0
  };
  if (Math.random() < 0.1) {
    AI = add(rand, AI);
  }
  // console.log(input)
  let movements = [input, AI];
  // console.log(dots[0],movements[0])
  dots = dots.map((dot, i) => updateDot(dot, movements[i]));

  let d = distance(...dots);

  if (d < 0.4) {
    health -= d * 0.1;
  } else {
    health += 0.01;
  }

  health = clamp(health);
  return {
    dots,
    AI,
    health
  };
}

function update([left, right]) {
  arenas = [updateArena(arenas[0], left), updateArena(arenas[1], right)];
}

let getArenaState = i => {
  return arenas[i];
};

module.exports = { getArenaState, update };
