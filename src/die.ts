export function die(reason?: string): never {
  throw new Error(reason);
}
