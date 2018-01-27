var gamepads = require("html5-gamepad");

let stick = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
let dots = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
let AI = { x: 0, y: 0 };

let healths = [1];

let clamp = v => Math.min(Math.max(v, -1), 1);
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
    x: clamp(x + friction(dx) * speed),
    y: clamp(y + friction(dy) * -speed)
  };
}

function render() {
  var gamepad = gamepads[0];
  // console.log(gamepad)
  let left = {
    x: gamepad.axis("left stick x"),
    y: gamepad.axis("left stick y")
  };

  let right = {
    x: gamepad.axis("right stick x"),
    y: gamepad.axis("right stick y")
  };

  rand = {
    x: (Math.random() - 0.5) * 2.0,
    y: (Math.random() - 0.5) * 2.0
  };
  if(Math.random()<0.1){
    AI = add(rand,AI);
  }
  right = AI

  stick = [left, right];
  dots = dots.map((dot, i) => updateDot(dot, stick[i]));

  let d = distance(...dots);
  if (d < 0.4) {
    healths[0] -= d * 0.1;
  } else {
    healths[0] += 0.01;
  }
  healths[0] = clamp(healths[0]);

  if (gamepad.button("a")) {
    // jump
  }

  window.requestAnimationFrame(render);
}

window.addEventListener("gamepadconnected", function(e) {
  gamepads[0].mapping.axes["right stick x"] = { index: 3 };
  gamepads[0].mapping.axes["right stick y"] = { index: 4 };

  window.requestAnimationFrame(render);
});

function stickState() {
  return stick;
}
function gameState() {
  return dots;
}
function healthState() {
  return healths;
}
module.exports = { stickState, gameState, healthState };
