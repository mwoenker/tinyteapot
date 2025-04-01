export type Vec2 = [number, number];

export function v2add(a: Vec2, b: Vec2): Vec2 {
  return [a[0] + b[0], a[1] + b[1]];
}

export function v2sub(a: Vec2, b: Vec2): Vec2 {
  return [a[0] - b[0], a[1] - b[1]];
}

export function v2scale(scale: number, v: Vec2): Vec2 {
  return [v[0] * scale, v[1] * scale];
}

// Cross product of two 2d vectors. By definition the result of crossing two
// vectors in xy plane is a vector that only has magnitude in the z direction,
// and none in xy directions. So we only return the z magnitude.
export function v2cross(a: Vec2, b: Vec2): number {
  return a[0] * b[1] - a[1] * b[0];
}

export function v2equal(a: Vec2, b: Vec2): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

export type Vec3 = [number, number, number];

export function v3add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function v3sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function v3scale(scale: number, v: Vec3): Vec3 {
  return [v[0] * scale, v[1] * scale, v[2] * scale];
}

export function v3equal(a: Vec3, b: Vec3): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

export function v3tov2(v: Vec3): Vec2 {
  return [v[0], v[1]];
}
