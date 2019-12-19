/**
 * @name 构造dom元素类
 * @see 拿到vdom实例，然后传入Element实例化构建dom节点
 * @see 数据结构看vdom.js
 * 
 * @see api要熟练，不然只有查MDN的份了。。。附上用到的api在MDN上的链接
 * @host https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createTextNode
 * @host https://developer.mozilla.org/zh-CN/docs/Web/API/Element/setAttribute
 * 
 * @see props[key]为value，如果type是input或textArea，直接改input或textArea的value
 * @see props[key]为class，需要通过setAttribute(key,props[key])来设置class
 * @see props[key]为style，需要通过cssText来直接赋值
 */

class Element {
  constructor (type, props, children) {
    this.type = type
    this.props = props
    this.children = children || []
    return this.createDom()
  }
  createDom () {
    let dom = document.createElement(this.type)
    setArr(dom, this.type, this.props)
    this.children.forEach(element => {
      if (typeof element !== 'string') {
        dom.appendChild(createElement(element))
      } else {
        dom.appendChild(document.createTextNode(element))
      }
    })
    return dom
  }
}

const setArr = (dom, type, props) => {
  for (let key in props) {
    if (!props.hasOwnProperty(key)) {
      continue
    }
    switch (key) {
      case 'style':
        dom.style.cssText = props[key]
        break
      case 'value':
        if (type === 'input' || type === 'textArea') {
          dom.value = props[key]
        }
        break
      default:
        dom.setAttribute(key, props[key])
        break
    }
  }
}

export const createElement = (vdom) => {
  return new Element(vdom.type, vdom.props, vdom.children)
}

