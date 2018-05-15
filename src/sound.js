import Tone from "tone";
let player;

function sound() {
  window.synths = [0, 1].map(() =>
    new Tone.PolySynth(6, Tone.Synth, {
      oscillator: {
        partials: [0, 2, 3, 4]
      }
    }).toMaster()
  );

  window.synths.map(s => {
    s.set("volume", 5);
    s.triggerAttack("C4");
    s.set("frequency", 0);
  });

  music();
}

let blooper = new Tone.PolySynth(6, Tone.Synth, {
  oscillator: {
    partials: [0, 2, 3, 4]
  }
}).toMaster();

function bloop(n) {
  blooper.triggerAttackRelease("A4", 0.1);
  blooper.set("frequency", (5 - n) * 100);
  blooper.set("volume", 0.1);
}

function music() {
  player = new Tone.Player({
    url: "./resources/birds-lament.ogg",
    loop: true
  }).toMaster();
  // player.autostart = true;
  player.volume.value = -18;
}

function setRate(rate) {
  player.playbackRate = rate;
}

export { sound, bloop, setRate };
