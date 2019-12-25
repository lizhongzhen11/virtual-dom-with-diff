export const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

// 深拷贝，fathers避免循环引用
export const deepClone = (obj, fathers = []) => {
  if (isPrimitive(obj)) {
    return obj
  }
  let result = Array.isArray(obj) ? [] : {}
  Object.keys(obj).forEach(key => {
    switch(Object.prototype.toString.call(obj[key])) {
      case '[object Object]':
        fathers.push(obj)
        if (!fathers.includes(obj[key])) {
          result[key] = deepClone(obj[key], fathers)
        }
        break
      case '[object Array]':
        fathers.push(obj)
        result[key] = []
        if (!fathers.includes(obj[key])) {
          obj[key].forEach((item, index) => {
            if (isPrimitive(item)) {
              result[key][index] = item
              return
            }
            result[key][index] = deepClone(item, fathers)
          })
        }
        break
      case '[object Function]':
        result[key] = obj[key].bind(obj)
        break
      default:
        result[key] = obj[key]
        break
    }
  })
  return result
}

const isPrimitive = (obj) => {
  const primitives = [
    '[object Null]',
    '[object Undefined]',
    '[object Boolean]',
    '[object Number]',
    '[object String]',
    '[object BigInt]',
  ]
  return primitives.includes(Object.prototype.toString.call(obj))
}

export const isString = (str) => Object.prototype.toString.call(str) === '[object String]'