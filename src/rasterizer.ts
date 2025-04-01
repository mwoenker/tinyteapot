import { getPixel } from "./color.js";
import { v2cross, v3sub, v3tov2, Vec2, Vec3 } from "./vector.js";

export class Rasterizer {
  private context: CanvasRenderingContext2D;
  private imageData: ImageData;
  private pixels: Uint32Array;

  constructor(private canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("cannot get context");
    }
    this.context = context;
    this.imageData = new ImageData(canvas.width, canvas.height);
    this.pixels = new Uint32Array(this.imageData.data.buffer);
  }

  clear(color: Vec3): void {
    this.pixels.fill(getPixel(color));
  }

  private putPixel(x: number, y: number, pixel: number): void {
    if (x < 0 || x >= this.imageData.width) {
      //throw new Error("x out of bounds");
      return;
    }
    if (y < 0 || y >= this.imageData.height) {
      //throw new Error("y out of bounds");
      return;
    }
    this.pixels[this.imageData.width * y + x] = pixel;
  }

  lineXMajor(e1: Vec2, e2: Vec2, pixel: number) {
    let startPoint: Vec2;
    let endPoint: Vec2;
    if (e1[0] < e2[0]) {
      startPoint = e1;
      endPoint = e2;
    } else {
      startPoint = e2;
      endPoint = e1;
    }
    const yPerX = (e1[1] - e2[1]) / (e1[0] - e2[0]);
    const endX = Math.min(endPoint[0], this.canvas.width - 1);
    let x = Math.max(0, Math.ceil(startPoint[0]));
    let y = startPoint[1] + yPerX * (x - startPoint[0]);
    for (; x <= endX; ++x, y += yPerX) {
      this.putPixel(x, Math.ceil(y), pixel);
    }
  }

  lineYMajor(e1: Vec2, e2: Vec2, pixel: number) {
    let startPoint: Vec2;
    let endPoint: Vec2;
    if (e1[1] < e2[1]) {
      startPoint = e1;
      endPoint = e2;
    } else {
      startPoint = e2;
      endPoint = e1;
    }
    const xPerY = (e1[0] - e2[0]) / (e1[1] - e2[1]);
    const endY = Math.min(endPoint[1], this.canvas.height - 1);
    let y = Math.max(0, Math.ceil(startPoint[1]));
    let x = startPoint[0] + xPerY * (y - startPoint[1]);
    for (; y <= endY; ++y, x += xPerY) {
      this.putPixel(Math.ceil(x), y, pixel);
    }
  }

  line(e1: Vec2, e2: Vec2, color: Vec3) {
    const pixel = getPixel(color);
    const xSize = Math.abs(e2[0] - e1[0]);
    const ySize = Math.abs(e2[1] - e1[1]);
    if (xSize > ySize) {
      this.lineXMajor(e1, e2, pixel);
    } else {
      this.lineYMajor(e1, e2, pixel);
    }
  }

  finishFrame(): void {
    this.context.putImageData(this.imageData, 0, 0);
  }
}
