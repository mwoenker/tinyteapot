import { startAnimation } from "./controller.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById("screen") as HTMLCanvasElement;
  startAnimation(canvas);
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resize);
  resize();
});
