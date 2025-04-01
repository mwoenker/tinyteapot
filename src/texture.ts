function isPowerOfTwo(n: number): boolean {
  return n >= 1 && n === Math.floor(n) && (n & n - 1) === 0;
}

export class Texture {
  uMask: number;
  vMask: number;
  // Is shift really faster than multiply? Idea is to keep everything in Int32 operations
  // but who knows what the VM actually does
  rowShift: number;

  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly pixels: ArrayLike<number>
  ) {
    if (!isPowerOfTwo(width)) {
      throw new Error('width must be power of two');
    }
    if (!isPowerOfTwo(height)) {
      throw new Error('height must be power of two');
    }
    this.uMask = width - 1;
    this.vMask = height - 1;
    this.rowShift = Math.log2(width);
  }

  sample(u: number, v: number): number {
    const column = this.uMask & (u * this.width);
    const row = this.vMask & (v * this.height);
    return this.pixels[row << this.rowShift + column];
  }
}
