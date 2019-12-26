/**
 * @name 虚拟dom结构
 * @author lizhongzhen11
 * @default 很多api我都不熟，对着MDN来写，好尴尬。只能先搞出来理解一遍
 * @see 这很重要，先规划好结构再去编写
 * @constructs:
 * {
 *   type: 'div',
 *   props: {
 *     class: '',
 *     style: ''
 *   },
 *   children: ['lizz', 
 *     {
 *       type: 'span',
 *       props: {
 *         class: 'center',
 *         style: 'color: red; font-size: 20px;'
 *       },
 *       children: []
 *     },
 *     {
 *       type: 'input',
 *       props: {
 *         class: '',
 *         style: '',
 *         value: '1'
 *       } 
 *     }
 *   ]
 * }
 * 
 * @see api要熟练，不然只有查MDN的份了。。。附上用到的api在MDN上的链接
 * @host https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeName
 * @host https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
 * @host https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeValue
 * @host https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleDeclaration/cssText
 * @host https://developer.mozilla.org/zh-CN/docs/Web/API/Element/classList
 */

class Vdom {
  constructor (dom) {
    this.type = dom.nodeName.toLowerCase()
    this.props = {}
    this.children = []
    if (dom.cssText) {
      this.props.style = dom.style.cssText
    }
    if (dom.classList.length) {
      this.props.class = Array.from(dom.classList).join(',')
    }
    if (this.type === 'input' || this.type === 'textarea') {
      this.props.value = dom.value
    }
    if (dom.childNodes) {
      Array.from(dom.childNodes).forEach(node => {
        if (node.nodeType === 1) {
          this.children.push(new Vdom(node))
        }
        if (node.nodeType === 3) {
          this.children.push(node.nodeValue)
        }
      })
    }
    return this
  }
}

export default Vdom