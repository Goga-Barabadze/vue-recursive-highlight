export function firstNonNull (...args: unknown []) {
  return args.find(arg => arg != null)
}

export function mergeObjects (...args: Record<string, unknown> []) {
  let object = {}
  args.forEach(arg => {
    object = {
      ...object,
      ...arg,
    }
  })
  return object
}