import { Vec3 } from "./vector";

export interface MeshLine {
  readonly start_: number;
  readonly end_: number;
}

export interface Mesh {
  readonly lines_: ReadonlyArray<MeshLine>;
  readonly points_: ReadonlyArray<Vec3>;
}
