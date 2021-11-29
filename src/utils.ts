
export const isObject = (obj: unknown) => {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    Object.prototype.toString.call(obj) === '[object Object]'
  )
}
