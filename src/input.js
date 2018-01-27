let gamepads = require("html5-gamepad");
const { update } = require("./logic");

function tick() {
  let gamepad = gamepads[0];
  let left = {
    x: gamepad.axis("left stick x"),
    y: gamepad.axis("left stick y")
  };

  let right = {
    x: gamepad.axis("right stick x"),
    y: gamepad.axis("right stick y")
  };
  
  update([left,right]);

  if (gamepad.button("a")) {
  }

  window.requestAnimationFrame(tick);
}

let start = ()=>{
  window.addEventListener("gamepadconnected", function(e) {
    gamepads[0].mapping.axes["right stick x"] = { index: 3 };
    gamepads[0].mapping.axes["right stick y"] = { index: 4 };
    window.requestAnimationFrame(tick);
  });
}

module.exports = start;
