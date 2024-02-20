export function getFirstObject<T extends object>(arr: T[]): T | null {
  if (arr.length > 0 && arr[0] !== null) {
    return arr[0]
  }
  return null
}
