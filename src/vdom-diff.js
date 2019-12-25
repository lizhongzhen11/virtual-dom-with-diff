import { isString, isObject } from './utils'
import Vdom from './vdom'
import VPatch from './vpatch'
import { diffProps } from './diff-props'

/**
 * @name diff
 * @see 这个diff其实就是virtual-dom库的diff
 */
// vdom数据结构示例
// {
//   type: 'div',
//   props: {
//     class: '',
//     style: ''
//   },
//   children: ['lizz', 
//     {
//       type: 'span',
//       props: {
//         class: 'center',
//         style: 'color: red; font-size: 20px;'
//       },
//       children: []
//     },
//     {
//       type: 'input',
//       props: {
//         class: '',
//         style: '',
//         value: '1'
//       } 
//     }
//   ]
// }

// 使用index.js中的示例，调用diff方法得到的数据结构示例
// {
//   0: {
//     vdom: {
//       // 旧的根节点，省略了...
//     },
//     patch: {
//       props: {class: 'flex'}
//     }
//   },
//   1: {
//     vdom: {
//       // 旧input节点，省略了...
//     },
//     patch: {
//       props: {
//         value: '无始天帝'
//       }
//     }
//   },
//   2: {
//     vdom: {
//       // 旧span节点，省略
//     },
//     patch: {
//       props: {
//         class: 'flex justify-center aligin-center'
//       }
//     }
//   }
// }

const isVdom = (vdom) => vdom instanceof Vdom

export const diff = (oldVdom, newVdom) => {
  let patches = {} // 最终所有的差异都会被保存在该对象内
  // 用于patches属性key，从0开始，依次递增，
  // 采用先序优先深度遍历，
  // 例如假设根节点有差异，那么差异对象会放入patches[0]，
  // 根节点的第一个子节点有差异，差异对象会放入patches[1]，
  // 如果根节点的第一个子节点内还有孙节点，去遍历孙节点，差异对象放入对应的patches[index]，
  // 这个过程index必须保证依次递增，避免key冲突，直到第一个子节点和它的子孙遍历完，
  // 再去继续递归遍历第二个子节点，保证index的连续性，然后第三个，第四个依此类推
  let index = 0 
  walk(oldVdom, newVdom, patches, index) // 递归树，比较新旧差异，放进patches
  return patches
}

const walk = (oldVdom, newVdom, patches, index) => {
  if (oldVdom === newVdom) { // 完全没变化
    return index
  }

  // 缓存当前层级的所有差异(补丁)
  // 因为我的vdom结构和virtual-dom库中的结构不一致，所以内部实际处理也不同，
  // 我需要去确定层级以及每一层的所有补丁
  // 但是virtual-dom库则不同，它哪怕是textNode节点都有对应的type，
  // 而且，最为重要的是，virtual-dom库把所有的差异全部平铺到patches对象上，
  // 不用像我这样保留层级，这样在patch方法内可以减少递归！
  // 当然，为了确定应用到哪个node节点上，它还顺带把对应的node节点的vnode数据也缓存进patches对象上！！！
  // 这样调用patch方法更新时就方便确定了，
  // 而我自己写的diff方法得到的 {'1-3': {'2-0': {props: {class: 'flex justify-center aligin-center'}}}} 
  // 简直不能比，我写的diff得到的还是嵌套对象，即使应用更新还需要递归我的diffs，性能差距很大

  if (isString(oldVdom) && isString(newVdom)) {
    if (oldVdom !== newVdom) {
      patches[index++] = newVdom
    }
  }

  if (isVdom(oldVdom) && isVdom(newVdom)) {
    // 拿到新旧vdom的props差异对象
    let propsPatch = diffProps(oldVdom.props, newVdom.props)
    if (propsPatch) {
      // 先拿到当前节点对应的props差异对象
      patches[index++] = new VPatch(oldVdom, {props: propsPatch})
    }
    // 如果存在children，需要去通过diffChildren方法内部递归调用walk，
    // 同时会把patches对象传进去，保证每层节点的差异对象全部平铺放到patches中
    // index作为patches对象的key，必须保证不断自增，所以内部递归自增后需要返回最新的值，
    // 这样才能保证后面的节点如果有patch对象，放进patches属性key不冲突
    index = diffChildren(oldVdom.children, newVdom.children, patches, index)
  }

  return index
}


// 遍历新旧vdom的children（如果有的话）
// 获取children中一一对应的patch对象，然后平铺放到patches对象
// 内部需要调用walk方法
const diffChildren = (oldChildren, newChildren, patches, index) => {
  let len = oldChildren.length > newChildren.length ? oldChildren.length : newChildren.length
  for (let i = 0; i < len; i++) {
    if (newChildren[i]) {
      index = walk(oldChildren[i], newChildren[i], patches, index)
    } else {
      patches[index++] = null
    }
  }
  return index
}
