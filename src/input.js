let gamepads = require("html5-gamepad");
const { update } = require("./logic");

let frame;

function tick() {
  let gamepad = gamepads[0];
  if(!gamepad){ return}
  // console.log(gamepad)
  let left = {
    x: gamepad.axis("left stick x"),
    y: gamepad.axis("left stick y")
    // x: gamepad.gamepad.axes[0],
    // y: gamepad.gamepad.axes[1]
  };

  let right = {
    x: gamepad.axis("right stick x"),
    y: gamepad.axis("right stick y")
    // x: gamepad.gamepad.axes[2],
    // y: gamepad.gamepad.axes[3]
  };

  update([left,right]);

  if (gamepad.button("a")) {
    // console.log("a")
  }

  window.requestAnimationFrame(tick);
}

let start = ()=>{
  window.cancelAnimationFrame(frame);
  frame = window.requestAnimationFrame(tick);
  window.addEventListener("gamepadconnected", function(e) {
    gamepads[0].mapping.axes["right stick x"] = { index: 3 };
    gamepads[0].mapping.axes["right stick y"] = { index: 4 };
      // console.log(gamepads[0].mapping.axes)
    // gamepads[0].mapping.axes["left stick x"] = { index: 0 };
    // gamepads[0].mapping.axes["left stick y"] = { index: 1 };
    // gamepads[0].mapping.axes["right stick x"] = { index: 2 };
    // gamepads[0].mapping.axes["right stick y"] = { index: 3 };
    // window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(tick);
  });
}

window.addEventListener("load", () => start(), false);

module.exports = start;
