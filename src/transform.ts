import { Vec3 } from "./vector.js";

export type GlMatrix = Float32Array;

export function transformVec3ByGlMatrix(matrix: GlMatrix, v: Vec3): Vec3 {
  const extended = [...v, 1];
  const result: Vec3 = [0, 0, 0];
  for (let resultDim = 0; resultDim < 3; ++resultDim) {
    for (let i = 0; i < 4; ++i) {
      result[resultDim] += matrix[4 * i + resultDim] * extended[i];
    }
  }
  return result;
}

export function multiplyMatrices(
  left: GlMatrix,
  right: GlMatrix,
): Float32Array {
  const result = new Float32Array(16);
  for (let leftRow = 0; leftRow < 4; ++leftRow) {
    for (let rightCol = 0; rightCol < 4; ++rightCol) {
      let sum = 0;
      for (let i = 0; i < 4; ++i) {
        sum += left[i * 4 + leftRow] * right[rightCol * 4 + i];
      }
      result[rightCol * 4 + leftRow] = sum;
    }
  }
  return result;
}

export function rotateAroundX(angle: number): GlMatrix {
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
}

export function rotateAroundY(angle: number): GlMatrix {
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  return new Float32Array([c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1]);
}

export function rotateAroundZ(angle: number): GlMatrix {
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}
