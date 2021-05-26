export function verifyType<T>(val: T, valType: string): boolean {
  return typeof val === valType;
}
