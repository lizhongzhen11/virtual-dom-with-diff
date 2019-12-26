import { isString } from './utils'

/**
 * 
 * @param {*} rootNode 
 * @param {*} vdom 
 * @param {*} patches
 * @description 更新
 */
export const patch = (rootNode, vdom, patches) => {
  let patchArr = Array.from(patches)
  applyPatch(rootNode, vdom, patchArr)
  return rootNode
}

/**
 * 
 * @param {*} node 
 * @param {*} vdom 
 * @param {*} patchArr
 * @description 应用patch更新 
 */
const applyPatch = (node, vdom, patchArr) => {
  let patch = patchArr[0]
  if (vdom === patch.vdom) { // 确定节点，应用更新
    patchArr.splice(0, 1)
    if (isString(patch.patch)) { // 文字节点
      node.parentNode.replaceChild(document.createTextNode(patch.patch), node)
      return
    } else {
      applyProps(node, vdom, patch.patch.props)
    }
  }
  // 子节点遍历，若有后代节点，内部继续递归遍历
  Array.from(node.childNodes).forEach((child, index) => patchArr.length && applyPatch(child, vdom.children[index], patchArr))
}

// 将props对象中的属性值应用到对应的node节点上
const applyProps = (node, vdom, props) => {
  Object.keys(props).forEach(key => {
    switch(key) {
      case 'class':
        node.setAttribute(key, props[key])
        break
      case 'style':
        node.style.cssText = props[key]
        break
      case 'value':
        if (vdom.type === 'input' || vdom.type === 'textarea') {
            node.value = props[key]
            node.setAttribute(key, props[key])
        }
        break
      default:
        node[key] = props[key]
        break
    }
  })
}