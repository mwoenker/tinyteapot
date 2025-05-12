import { Mesh } from "./mesh.js";
import { die } from "./die.js";
import { multiplyMatrices, rotateAroundX, rotateAroundY } from "./transform.js";
import { setShaderParameters, bindShaderAndGeometry } from "./shaders.js";
import { createTeapotMeshes } from "./teapotPatchesQuantized.js";

interface Controller {
  renderFrame_: () => void;
  run_: () => void;
  stop_: () => void;
}

const now = Date.now;

export function makeController(canvas: HTMLCanvasElement): Controller {
  let running = false;
  let startTime = now();

  const meshes: Mesh[] = createTeapotMeshes(15);
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    //die("context");
    die();
  }
  const positions: number[] = [];
  const indexes: number[] = [];
  let indexBase = 0;
  for (const mesh of meshes) {
    for (const v of mesh.points_) {
      v.forEach((x) => positions.push(x));
    }
    for (const { start_, end_ } of mesh.lines_) {
      indexes.push(start_ + indexBase);
      indexes.push(end_ + indexBase);
    }
    indexBase += mesh.points_.length;
  }
  const positionsBuffer = new Float32Array(positions);
  const indexesBuffer = new Uint16Array(indexes);
  const shaderParameterLocations_ = bindShaderAndGeometry(
    gl,
    positionsBuffer,
    indexesBuffer,
  );

  const result = {
    renderFrame_() {
      const t = now();
      const theta = 4e-4 * (t - startTime);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.lineWidth(1);
      const xRotation = rotateAroundX(0.3 * theta);
      const yRotation = rotateAroundY(theta);
      const rotation = multiplyMatrices(xRotation, yRotation);
      const aspectRatio = canvas.height / canvas.width;
      setShaderParameters(gl, shaderParameterLocations_, aspectRatio, rotation);
      gl.drawElements(gl.LINES, indexesBuffer.length, gl.UNSIGNED_SHORT, 0);
    },

    run_() {
      running = true;
      requestAnimationFrame(() => {
        if (!running) {
          return;
        }
        result.renderFrame_();
        result.run_();
      });
    },

    stop_() {
      running = false;
    },
  };

  return result;
}
