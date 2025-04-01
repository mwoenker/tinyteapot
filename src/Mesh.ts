import { Vec3 } from "./vector";

export interface MeshLine {
  readonly start: number;
  readonly end: number;
}

export interface Mesh {
  readonly lines: ReadonlyArray<MeshLine>;
  readonly points: ReadonlyArray<Vec3>;
}
