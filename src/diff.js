import { isObject } from './utils'

/**
 * @name diff
 * @see 我自己写的diff，和virtual-dom库以及网上参考文章有较大区别
 * @param {*} oldVdom 
 * @param {*} newVdom 
 * @param {*} level 
 * @description 我通过递归确定差异与层级，如果是children内部的差异，
 *              我会将层级和children的下标组合成键名，对应的差异作为键值存入对象中，
 *              但是如果新vdom结构有所改变，即节点都变了，我这就没有考虑了
 */

// 数据结构
// {
//   type: '',
//   props: {
//     value: '',
//     style: '',
//     class: ''
//   },
//   children: [
//     'a',
//     {
//       type: '',
//       props: {
//         style: '',
//         class: '',
//         value: ''
//       },
//       children: []
//     }
//   ]
// }

// 返回格式例如：
// {
//   props: {
//     class: 'flex'
//   },
//   '1-1': {
//     props: {
//       value: '无始天帝'
//     }
//   },
//   '1-3': {
//     '2-0': {
//       props: {
//         class: 'flex justify-center aligin-center'
//       }
//     }
//   }
// }

// 获取新旧vdom不同之处
export const diff = (oldVdom, newVdom, level = 0) => {
  let diffs = {} // 遍历oldVdom, newVdom，存放两者的不同，以newVdom为主
  if (isObject(newVdom) && isObject(oldVdom)) {
    Object.keys(newVdom).forEach(newKey => {
      if (!oldVdom.hasOwnProperty(newKey)) {
        diffs[newKey] = newVdom[newKey] // newVdom中有但oldVdom没有，放进去用于添加
      }
    })

    Object.keys(oldVdom).forEach(oldKey => {
      let oldChild = oldVdom[oldKey]
      let newChild = newVdom[oldKey]
      if (isObject(oldChild) && isObject(newChild)) { // 都是对象，可能都是props
        let childDiffs = diff(oldChild, newChild, level)
        if (childDiffs && Object.keys(childDiffs).length) { // 确实有不同值，才放进diffs
          diffs[oldKey] = childDiffs
        }
        return
      }

      if (Array.isArray(oldChild) && Array.isArray(newChild)) { // 都是数组，即都是children字段
        level++
        oldChild.forEach((oldItem, oldIndex) => {
          let childDiffs = diff(oldItem, newChild[oldIndex], level)
          if (childDiffs && Object.keys(childDiffs).length) { // 确实有不同值，才放进diffs
            diffs[`${String(level)}-${oldIndex}`] = childDiffs
          }
        })

        let oldLen = oldChild.length
        let newLen = newChild.length
        if (newLen > oldLen) {
          newChild.slice(oldLen).forEach((newItem, newIndex) => {
            diffs[`${String(level)}-${oldLen + newIndex}`] = newItem
          })
        }
        return
      }
      if (oldChild !== newChild) { // 只要有一个不是对象，则以newChild为主
        diffs[oldKey] = newChild || null
      }
    })

  } else {
    return oldVdom === newVdom ? null : newVdom
  }
  return diffs
}
