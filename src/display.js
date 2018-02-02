import { bloop } from "./sound";
let lScore = document.getElementById("lScore");
let rScore = document.getElementById("rScore");

let countdown = document.getElementById("countdown");

function showScore([left, right]) {
  lScore.textContent = left;
  rScore.textContent = right;
}
function showCountDown(n, start) {
  if (n === -1) {
    bloop(-3);
    start();
    countdown.textContent = "";
  } else {
    bloop(3);
    countdown.textContent = n;
    window.setTimeout(() => showCountDown(n - 1, start), 1000);
  }
}

function showWinner(winner) {
  let color = winner ? "Red" : "Blue";
  countdown.textContent = `${color} Wins!`;
  //   countdown.className = color;
}

export { showScore, showCountDown, showWinner };
