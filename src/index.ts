import { Controller } from "./controller.js";

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
});
