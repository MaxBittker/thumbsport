import Tone from "tone";

function sound() {
  window.synths = [0, 1].map(() =>
    new Tone.PolySynth(6, Tone.Synth, {
      oscillator: {
        partials: [0, 2, 3, 4]
      }
    }).toMaster()
  );

  window.synths.map(s => {
    s.set("volume", 25);
    s.triggerAttack("C4");
    s.set("frequency", 0);
  });
}
let blooper = new Tone.PolySynth(6, Tone.Synth, {
  oscillator: {
    partials: [0, 2, 3, 4]
  }
}).toMaster();

function bloop(n) {
  blooper.triggerAttackRelease("C4", 0.1);
  blooper.set("frequency", (5 - n) * 100);
}

export { sound, bloop };
