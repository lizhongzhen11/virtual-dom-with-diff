import Vdom from './src/vdom'
import { createElement }  from './src/element'

let node = document.querySelector('#root')
let vdom = new Vdom(node)
console.log(vdom)

vdom.children[1].props.value = '无始天帝'
// https://developer.mozilla.org/zh-CN/docs/Web/API/Node/replaceChild
node.parentNode.replaceChild(createElement(vdom), node)