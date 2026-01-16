import { startAnimation } from "./controller.js";
import { die } from "./die.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById("screen") as HTMLCanvasElement;
  startAnimation(canvas);
  const resize = () => {
    console.log("do");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log("did");
  };
  window.addEventListener("resize", resize);
  resize();
});
