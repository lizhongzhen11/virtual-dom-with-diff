import { isObject } from './utils'

export const diffProps = (oldProps, newProps) => {
  let propsPatch
  Object.keys(newProps).forEach(key => { // 新vdom有的props属性，但是旧的没有
    if (!oldProps.hasOwnProperty(key)) {
      propsPatch = propsPatch || {}
      propsPatch[key] = newProps[key]
    }
  })

  Object.keys(oldProps).forEach(key => {
    // 新旧vdom的props都有的属性，但是值不同
    if (newProps.hasOwnProperty(key) && oldProps[key] !== newProps[key]) {
      propsPatch = propsPatch || {}
      propsPatch[key] = newProps[key]
    }
  })
  return propsPatch
}