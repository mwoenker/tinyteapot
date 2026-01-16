import { Vec3 } from "./vector";

export interface Mesh {
  readonly indexes_: ReadonlyArray<number>;
  readonly points_: ReadonlyArray<Vec3>;
}
