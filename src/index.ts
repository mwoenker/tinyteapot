import { Controller } from "./controller.js";
import { die } from "./die";

window.addEventListener("load", () => {
  const canvas = document.getElementById("screen");
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    die("canvas");
  }
  const controller = new Controller(canvas);
  controller.run();
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      controller.stop();
    }
  });
});
