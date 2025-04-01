import { Controller } from "./controller.js";

// Average each sample w/ next sample in place
function smooth(samples: Float32Array): void {
  for (let i = 0; i < samples.length; ++i) {
    samples[i] = (samples[i] + samples[(i + 1) % samples.length]) / 2;
  }
}

// fill buffer with square wave, wavelength = length of buffer
function square(samples: Float32Array): void {
  for (let i = 0; i < samples.length; ++i) {
    if (i < samples.length / 2) {
      samples[i] = -1;
    } else {
      samples[i] = 1;
    }
  }
}

const bufSize = 36;
const smoothingIterations = 8000;
const sampleRate = 22000;

function makeBeep(context: AudioContext): AudioBuffer {
  const audioBuffer = context.createBuffer(
    1,
    bufSize * smoothingIterations + 1,
    sampleRate,
  );
  const beep = audioBuffer.getChannelData(0);

  const slice = new Float32Array(bufSize);
  square(slice);
  beep.set(slice, 0);
  for (let i = 1; i < smoothingIterations - 1; ++i) {
    smooth(slice);
    beep.set(slice, bufSize * i);
  }
  smooth(slice);
  beep.set(slice, bufSize * (smoothingIterations - 1));

  for (let i = 0; i < 50; ++i) {
    smooth(beep);
  }
  console.log([...beep].slice(beep.length - 10));
  return audioBuffer;
}

window.addEventListener("load", () => {
  const canvas = document.getElementById("screen");
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    throw new Error("canvas not found");
  }
  const controller = new Controller(canvas);
  controller.run();
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      controller.stop();
    }
  });

  // const button = document.createElement("BEEP");
  // button.innerText = "Hi!";
  // button.addEventListener("click", () => {
  //   const audioContext = new AudioContext();
  //   const beep = makeBeep(audioContext);
  //   if (audioContext.state === "suspended") {
  //     audioContext.resume();
  //   }
  //   const source = audioContext.createBufferSource();
  //   source.buffer = beep;
  //   source.connect(audioContext.destination);
  //   source.start();
  //   console.log(source);
  // });
  // document.body.appendChild(button);
});
