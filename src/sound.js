import Tone from "tone";

function sound() {
  //create a synth and connect it to the master output (your speakers)
  // new Tone.FatOscillator("Ab3", "sine", "square")
  // var fmOsc = new Tone.FatOscillator("Ab3", "sine", "square").toMaster().start();
  window.synths = [0, 1].map(() =>
    new Tone.PolySynth(6, Tone.Synth, {
      oscillator: {
        partials: [0, 2, 3, 4]
      }
    }).toMaster()
  );

  window.synths.map(s => {
    s.set("frequency", 0);
    s.set("volume", 50);
    s.triggerAttack("C4");
  });
  //   window.synths.map(s => (s.volume.value = 0));

  // window.synths.map(s => (s.oscillator.frequency.value = 0));
  // var synth = ;

  // window.synths = [0, 1].map(() =>
  // new Tone.FatOscillator("Ab3", "sine", "square").toMaster().start()
  // );
  // new Tone.FatOscillator("Ab3", "sine", "square").toMaster().start();
}

export { sound };
