export function firstNonNull (...args: unknown []) {
  return args.find(arg => arg != null)
}