let gamepads = require("html5-gamepad");
const { update, go } = require("./logic");

let frame;

function parseGamepad(gamepad) {
  let left = {
    x: gamepad.axis("left stick x"),
    y: gamepad.axis("left stick y")
  };

  let right = {
    x: gamepad.axis("right stick x"),
    y: gamepad.axis("right stick y")
  };

  if (gamepad.button("a")) {
    go();
  }

  return [left, right];
}
function tick() {
  let gamepad = gamepads[0];

  if (!gamepad) {
    return;
  }
  // debugger;
  // console.log(gamepad);

  navigator.getGamepads();
  let inputs = gamepads.map(parseGamepad);
  update(inputs);

  // if (gamepad.button("b")) {
  //   console.log("a");
  //   gamepads[0].mapping.axes["right stick x"] = { index: 3 };
  //   gamepads[0].mapping.axes["right stick y"] = { index: 4 };
  //   // gamepad;
  // }
  frame = window.requestAnimationFrame(tick);
}

function loop() {
  window.cancelAnimationFrame(frame);
  frame = window.requestAnimationFrame(tick);
}

let start = () => {
  // loop();
  window.addEventListener("gamepadconnected", loop);
  window.addEventListener("gamepaddisconnected", loop);
  // window.addEventListener("gamepadconnected", function(e) {
  //FF:
  // gamepads[0].mapping.axes["right stick x"] = { index: 3 };
  // gamepads[0].mapping.axes["right stick y"] = { index: 4 };
};

// window.addEventListener("load", () => start(), false);

module.exports = start;
