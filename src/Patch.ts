import { Mesh, MeshLine } from "./Mesh.js";
import { v3add, v3scale, Vec2, Vec3 } from "./vector.js";

type Corners = [[Vec3, Vec3], [Vec3, Vec3]];

function interp(s: number, t: number, corners: Corners): Vec3 {
  let result: Vec3 = [0, 0, 0];
  for (let i = 0; i < 2; ++i) {
    const sWeight = i === 0 ? s : 1 - s;
    for (let j = 0; j < 2; ++j) {
      const tWeight = j === 0 ? t : 1 - t;
      result = v3add(result, v3scale(sWeight * tWeight, corners[i][j]));
    }
  }
  return result;
}

function bezier(
  order: number,
  parameter: Vec2,
  base: Vec2,
  controlPoints: Vec3[][],
): Vec3 {
  const [s, t] = parameter;
  if (order < 0) {
    throw new Error("Invalid order");
  }
  if (order === 0) {
    return controlPoints[base[0]][base[1]];
  }
  return interp(s, t, [
    [
      bezier(order - 1, parameter, base, controlPoints),
      bezier(order - 1, parameter, [base[0], base[1] + 1], controlPoints),
    ],
    [
      bezier(order - 1, parameter, [base[0] + 1, base[1]], controlPoints),
      bezier(order - 1, parameter, [base[0] + 1, base[1] + 1], controlPoints),
    ],
  ]);
}

export class CubicPatch {
  constructor(private controlPoints: Vec3[][]) {
    if (controlPoints.length !== 4) {
      throw new Error("Invalid patch dimension");
    }
    for (let row = 0; row < 4; ++row) {
      if (controlPoints[row].length !== 4) {
        throw new Error("Invalid patch dimension");
      }
    }
  }

  sample(s: number, t: number) {
    if (s < 0 || s > 1 || t < 0 || t > 1) {
      throw new Error("Invalid patch parameter");
    }
    return bezier(3, [s, t], [0, 0], this.controlPoints);
  }

  mesh(sSubdivisions: number, tSubdivisions: number): Mesh {
    const pointIndex = (row: number, col: number): number =>
      row * (tSubdivisions + 1) + col;

    const points: Vec3[] = [];
    const lines: MeshLine[] = [];

    for (let row = 0; row <= sSubdivisions; ++row) {
      const s = row / sSubdivisions;
      for (let col = 0; col <= tSubdivisions; ++col) {
        const t = col / tSubdivisions;
        if (points.length !== pointIndex(row, col)) {
          throw new Error("we don't know how to compute indexes");
        }
        points.push(this.sample(s, t));
      }
    }

    // row lines
    for (let row = 0; row <= sSubdivisions; ++row) {
      for (let col = 0; col < tSubdivisions; ++col) {
        lines.push({
          start: pointIndex(row, col),
          end: pointIndex(row, col + 1),
        });
      }
    }

    // t lines
    for (let col = 0; col <= tSubdivisions; ++col) {
      for (let row = 0; row < sSubdivisions; ++row) {
        lines.push({
          start: pointIndex(row, col),
          end: pointIndex(row + 1, col),
        });
      }
    }

    return { lines, points };
  }
}
