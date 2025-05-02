import { makeController } from "./controller.js";
import { die } from "./die.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById("screen");
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    //die("canvas");
    die();
  }
  const controller = makeController(canvas);
  controller.run_();
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      controller.stop_();
    }
  });
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resize);
  resize();
});
