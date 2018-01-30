let gamepads = require("html5-gamepad");
const { update } = require("./logic");

let frame;

function tick() {
  let gamepad = gamepads[0];

  if (!gamepad) {
    return;
  }
  // debugger;
  // console.log(gamepad);
  let left = {
    x: gamepad.axis("left stick x"),
    y: gamepad.axis("left stick y")
  };

  let right = {
    x: gamepad.axis("right stick x"),
    y: gamepad.axis("right stick y")
  };

  navigator.getGamepads();
  update([left, right]);

  if (gamepad.button("b")) {
    console.log("a");
    gamepads[0].mapping.axes["right stick x"] = { index: 3 };
    gamepads[0].mapping.axes["right stick y"] = { index: 4 };
    // gamepad;
  }
  navigator.getGamepads();
  window.requestAnimationFrame(tick);
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
// Gamepad connected at index 0: 45e-28e-Xbox 360 Wired Controller. 15 buttons, 6 axes.
