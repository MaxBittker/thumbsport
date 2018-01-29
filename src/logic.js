import _ from "lodash";
import { normalize, dirname } from "path";
let bound = 0.7;
let pack = ({ x, y }, f) => {
  return {
    x: f(x),
    y: f(y)
  };
};
let getClosestWall = p => {
  let { x, y } = p;
  let wallpoints = [
    { x, y: -bound },
    { x: -bound, y },
    { x: bound, y },
    { x, y: bound }
  ];

  let closestwall = wallpoints.reduce((min, wp) => {
    if (distance(wp, p) < distance(min, p)) {
      return wp;
    }
    return min;
  });
  return closestwall;
};

let clamp = (v, d = 1) => Math.min(Math.max(v, -d), d);
let friction = v => (Math.abs(v) < 0.3 ? 0 : v);

let distance = ({ x, y }, { x: bx, y: by }) =>
  Math.sqrt(Math.pow(x - bx, 2) + Math.pow(y - by, 2));

let clampVec = (p, d = 1) => pack(p, a => clamp(a, d));

let add = ({ x, y }, { x: bx, y: by }) => {
  return {
    x: x + bx,
    y: y + by
  };
};

let sub = (a, b) => add(a, scale(b, -1));
let mag = ({ x, y }) => Math.sqrt(x * x + y * y);
let scale = (p, s) => pack(p, a => a * s);
let norm = a => scale(a, 1 / (mag(a) || 0.001));
// console.log(norm({ x: 0, y: 0 }));
// console.log(distance({ x: 0, y: 10 }, { x: 90, y: 10 }));
// console.log(distance2({ x: 0, y: 10 }, { x: 90, y: 10 }));
// console.log(getClosestWall({ x: 0.5, y: 0.6 }));
// console.log(norm({ x: 50, y: -10 }));

// console.log(sub({ x: 1, y: 1 }, { x: 5, y: 1 }));

let speed = 3 / 100;

function updateDot({ x, y }, { x: dx, y: dy }) {
  return {
    x: clamp(x + friction(dx) * speed, bound),
    y: clamp(y + friction(dy) * -speed, bound)
  };
}

let makeArena = () => {
  return {
    dots: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
    AI: { x: 0, y: 0 },
    health: 1,
    d: 0
  };
};
let arenas = [makeArena(), makeArena()];

let set = v => Object.assign(state, v);
let wallpoint = {};
let runAI = ({ dots, AI }, side) => {
  let newAI = AI;
  let rand = {
    x: (Math.random() - 0.5) * 2.0,
    y: (Math.random() - 0.5) * 2.0
  };
  rand = scale(rand, 0.1);
  let attack = scale(norm(sub(dots[0], dots[1])), 0.5);
  attack.y *= -1;
  let repelWall = scale(norm(sub(getClosestWall(dots[1]), dots[1])), 20.0);
  let forces = [];
  if (Math.random() < 0.1) {
    if (side == 0) {
      attack = scale(attack, -1.0);
      forces = [rand, repelWall, attack];
    } else {
      forces = [rand, attack];
    }
    let fsum = norm(forces.reduce(add));
    newAI = add(newAI, fsum);
    newAI = clampVec(newAI, 0.6);
    // newAI.y *= -1;
  }
  return newAI;
};
function updateArena({ dots, AI, health }, input, side) {
  let newAI = runAI({ dots, AI }, side);

  let movements = [input, newAI];
  dots = dots.map((dot, i) => updateDot(dot, movements[i]));

  let d = distance(...dots);

  if (d < 0.4) {
    health -= (0.4 - d) * 0.008;
  } else {
    health += 0.0005;
  }

  health = clamp(health);
  return {
    dots,
    AI: newAI,
    health,
    d
  };
}

function checkWin({ health }, i) {
  if (health <= -1) {
    console.log(`Player ${i} Wins!`);
    arenas = [makeArena(), makeArena()];
  }
}

function update([left, right]) {
  arenas = [updateArena(arenas[0], left, 0), updateArena(arenas[1], right, 1)];
  arenas.map(checkWin);
}

let getArenaState = i => {
  return arenas[i];
};
export { getArenaState, update };
