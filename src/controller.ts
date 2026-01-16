import { Mesh } from "./mesh.js";
import { die } from "./die.js";
import { multiplyMatrices, rotateAroundX, rotateAroundY } from "./transform.js";
import { setShaderParameters, bindShaderAndGeometry } from "./shaders.js";
import { createTeapotMeshes } from "./teapotPatchesQuantized.js";

const now = Date.now;

export function startAnimation(canvas: HTMLCanvasElement): void {
  let startTime = now();

  const meshes: Mesh[] = createTeapotMeshes(15);
  const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
  const positions: number[] = [];
  let indexes: number[] = [];
  let indexBase = 0;
  for (const mesh of meshes) {
    for (const v of mesh.points_) {
      v.forEach((x) => positions.push(x));
    }
    indexes = indexes.concat(mesh.indexes_.map((i) => i + indexBase));
    indexBase += mesh.points_.length;
  }
  const positionsBuffer = new Float32Array(positions);
  const indexesBuffer = new Uint16Array(indexes);
  const shaderParameterLocations_ = bindShaderAndGeometry(
    gl,
    positionsBuffer,
    indexesBuffer,
  );

  const renderFrame = () => {
    requestAnimationFrame(() => {
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

      renderFrame();
    });
  };

  renderFrame();
}
