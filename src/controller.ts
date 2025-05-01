import { Mesh } from "./mesh.js";
import { die } from "./die.js";
import { multiplyMatrices, rotateAroundX, rotateAroundY } from "./transform.js";
import {
  setShaderParameters,
  bindShaderAndGeometry,
  ShaderParameterLocations,
} from "./shaders.js";
import { createTeapotMeshes } from "./teapotPatchesQuantized.js";

export class Controller {
  private running_ = false;
  private theta_ = 0;
  private meshes_: Mesh[];
  private gl_: WebGL2RenderingContext;
  private indexes_: Uint16Array;
  private positions_: Float32Array;
  private shaderParameterLocations_: ShaderParameterLocations;

  constructor(private canvas_: HTMLCanvasElement) {
    this.meshes_ = createTeapotMeshes(10);
    const gl = this.canvas_.getContext("webgl2");
    if (!gl) {
      die("context");
    }
    this.gl_ = gl;
    const positions: number[] = [];
    const indexes: number[] = [];
    let indexBase = 0;
    for (const mesh of this.meshes_) {
      for (const v of mesh.points_) {
        v.forEach((x) => positions.push(x));
      }
      for (const { start_, end_ } of mesh.lines_) {
        indexes.push(start_ + indexBase);
        indexes.push(end_ + indexBase);
      }
      indexBase += mesh.points_.length;
    }
    this.positions_ = new Float32Array(positions);
    this.indexes_ = new Uint16Array(indexes);
    this.shaderParameterLocations_ = bindShaderAndGeometry(
      gl,
      this.positions_,
      this.indexes_,
    );
  }

  renderFrame_() {
    const gl = this.gl_;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, this.canvas_.width, this.canvas_.height);
    gl.lineWidth(1);
    const xRotation = rotateAroundX(0.3 * this.theta_);
    const yRotation = rotateAroundY(this.theta_);
    const rotation = multiplyMatrices(xRotation, yRotation);
    const aspectRatio = this.canvas_.height / this.canvas_.width;
    setShaderParameters(
      gl,
      this.shaderParameterLocations_,
      aspectRatio,
      rotation,
    );
    gl.drawElements(gl.LINES, this.indexes_.length, gl.UNSIGNED_SHORT, 0);
  }

  update_() {
    this.theta_ += 0.005;
  }

  run_() {
    this.running_ = true;
    requestAnimationFrame(() => {
      if (!this.running_) {
        return;
      }
      this.renderFrame_();
      this.update_();
      this.run_();
    });
  }

  stop_() {
    this.running_ = false;
  }
}
