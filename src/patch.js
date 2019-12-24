// diffs可能的数据结构举例
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

// 将diffs应用到rootNode上更新节点
export const patch = (rootNode, node, oldVdom, diffs, currentLeve = 1) => {
  Object.keys(diffs).forEach(key => {
    if (oldVdom.hasOwnProperty(key)) {
      let props = diffs[key]
      Object.keys(props).forEach(propKey => { // 对props属性对应的对象进行遍历，应用修改
        switch(propKey) {
          case 'class':
            node.setAttribute(propKey, props[propKey])
            break
          case 'style':
            node.style.cssText = props[propKey]
            break
          case 'value':
            if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
              node.value = props[propKey]
              // 仅改值的确有用，但是浏览器中html结构中的value并没有改变，因为那个value代表初始属性值
              node.setAttribute(propKey, props[propKey])
            }
        }
      })
    } else {
      let keys = key.split('-') // 例如：['1', '1']
      let level = +keys[0] // 获取层级
      let index = +keys[1] // 获取在children数组中的位置
      let childNodes = node.childNodes
      for (let i = 0; i < childNodes.length; i++) {
        if (currentLeve === level && i === index) {
          let childNode = childNodes[i] // 拿到对应的节点
          let vdom = oldVdom.children[i] // 拿到节点对应的vdom
          let childDiffs = diffs[key] // 拿到对应的diffs
          patch(rootNode, childNode, vdom, childDiffs, currentLeve + 1) // 递归调用修改node
        }
      }
    }
  })
  return rootNode
}