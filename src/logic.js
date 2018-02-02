import { bloop } from "./sound";

import { showScore, showCountDown, showWinner } from "./display";

let bound = 0.7;
let score = [0, 0];
//start, play, count
let mode = "stop";

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

let makeArena = i => {
  return {
    dots: [{ x: 0, y: 0.5 * i }, { x: 0, y: -0.5 * i }],
    AI: { x: 0, y: 0 },
    health: 1,
    d: 0.0001
  };
};
let arenas = [makeArena(1), makeArena(-1)];

let resetArenas = () => {
  arenas = [makeArena(1), makeArena(-1)];
};

let set = v => Object.assign(state, v);
let wallpoint = {};

let runAI = ({ dots, AI, health, d }, side) => {
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
    newAI = clampVec(newAI, 1.0);
    // newAI.y *= -1;
  }
  return {
    AI: newAI,
    dots,
    health,
    d
  };
};
function updateArena({ dots, AI, health }, movements, side) {
  dots = dots.map((dot, i) => updateDot(dot, movements[i]));

  let d = distance(...dots);

  if (d < 0.4) {
    health -= (0.4 - d) * 0.04;
    // window.synths[side].oscillator.frequency.value = (0.4 - d) * 400;
    // window.synths[side].volume.value = 0.4 - d;
    window.synths[side].set("detune", d * -1000);
    window.synths[side].set("frequency", (0.4 - d) * 240);
  } else {
    health += 0.0005;
    // window.synths[side].oscillator.frequency.value = 0;
    window.synths[side].set("frequency", 0);
  }

  health = clamp(health);

  return {
    dots,
    AI,
    health,
    d
  };
}

function checkWin({ health }, i) {
  if (health <= -1) {
    mode = "stop";
    // alert(`Player ${i} Wins!`);
    score[i]++;
    showScore(score);
    showWinner(i);
    window.synths[0].set("frequency", 0);
    window.synths[1].set("frequency", 0);
  }
}

function update(inputs) {
  if (mode !== "play") {
    return;
  }

  if (inputs.length === 1) {
    arenas = arenas.map((arena, i) => runAI(arena, i));
    arenas = arenas.map((arena, i) =>
      updateArena(arena, [inputs[0][i], arena.AI])
    );
  } else {
    arenas = arenas.map((arena, i) =>
      updateArena(arena, [inputs[0][i], inputs[1][i]], i)
    );
  }
  arenas.map(checkWin);
}

let getArenaState = i => {
  return arenas[i];
};

let go = () => {
  if (mode !== "stop") {
    bloop(Math.random() * 2);
    return;
  }
  mode = "count";
  resetArenas();
  showCountDown(3, () => {
    mode = "play";
  });
};
export { getArenaState, update, go };
