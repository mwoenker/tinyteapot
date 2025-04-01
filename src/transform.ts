import { Vec3 } from "./vector.js";

type Matrix3x3 = [Vec3, Vec3, Vec3];

function transformVec3ByMatrix3x3(matrix: Matrix3x3, v: Vec3): Vec3 {
  const result: Vec3 = [0, 0, 0];
  for (let i = 0; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      result[i] += v[j] * matrix[i][j];
    }
  }
  return result;
}

export class Rotation {
  constructor(private matrix: Matrix3x3) {}

  static rotateAroundX(angle: number): Rotation {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    return new Rotation([
      [1, 0, 0],
      [0, c, -s],
      [0, s, c],
    ]);
  }

  static rotateAroundY(angle: number): Rotation {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    return new Rotation([
      [c, 0, -s],
      [0, 1, 0],
      [s, 0, c],
    ]);
  }
  static rotateAroundZ(angle: number): Rotation {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    return new Rotation([
      [c, -s, 0],
      [s, c, 0],
      [0, 0, 1],
    ]);
  }

  transform(v: Vec3): Vec3 {
    return transformVec3ByMatrix3x3(this.matrix, v);
  }
}
