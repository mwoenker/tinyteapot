import { Vec3 } from "./vector.js";

const U = 0.0405;
const A = 12.92;
const C = 0.055;
const T = 2.4;
const V = 0.0031308;

function gamma(n: number): number {
  const u = n / 255;
  if (u <= U) {
    return u / A;
  } else {
    return Math.pow((u + C) / (1 + C), T);
  }
}

function unGamma(v: number): number {
  if (v <= V) {
    return 255 * A * v;
  } else {
    return 255 * (1 + C) * Math.pow(v, 1.0 / T);
  }
}

function clamp(n: number, low: number, high: number): number {
  return Math.max(low, Math.min(high, n));
}

function lerp(t: number, a: number, b: number): number {
  return a + t * (b - a);
}

export function rgbStr(r: number, g: number, b: number): string {
  return `rgb(${r}, ${g}, ${b})`;
}

const gradientColors: Vec3[] = [
  [255, 0, 0],
  [255, 255, 0],
  [0, 255, 0],
  [0, 255, 255],
  [0, 0, 255],
  [255, 0, 255],
];

export function colorGradient(n: number): Vec3 {
  const fracIndex = (n - Math.floor(n)) * gradientColors.length;
  const firstIndex = Math.floor(fracIndex);
  const firstColor = gradientColors[firstIndex].map(gamma);
  const secondIndex = (firstIndex + 1) % gradientColors.length;
  const secondColor = gradientColors[secondIndex].map(gamma);
  const t = fracIndex - firstIndex;
  return [
    unGamma(lerp(t, firstColor[0], secondColor[0])),
    unGamma(lerp(t, firstColor[1], secondColor[1])),
    unGamma(lerp(t, firstColor[2], secondColor[2])),
  ];
}

// static buffers for packing pixels
const pixel32 = new Uint32Array(1);
const pixel8 = new Uint8Array(pixel32.buffer);

export function getPixel(color: Vec3): number {
  const r = Math.floor(clamp(color[0], 0, 255));
  const g = Math.floor(clamp(color[1], 0, 255));
  const b = Math.floor(clamp(color[2], 0, 255));
  pixel8[0] = r;
  pixel8[1] = g;
  pixel8[2] = b;
  pixel8[3] = 255;
  return pixel32[0];
}
