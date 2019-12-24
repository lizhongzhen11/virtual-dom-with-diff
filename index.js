import Vdom from './src/vdom'
import { createElement }  from './src/element'
import { diff } from './src/diff'
import { patch } from './src/patch'
import { deepClone } from './src/utils'

let node = document.querySelector('#root')
let vdom = new Vdom(node)
console.log(node)
console.log(vdom)

// vdom.children[1].props.value = '无始天帝'
// https://developer.mozilla.org/zh-CN/docs/Web/API/Node/replaceChild
// node.parentNode.replaceChild(createElement(vdom), node)

let newVdom = deepClone(vdom)
newVdom.props.class = 'flex'
newVdom.children[1].props.value = '无始天帝'
newVdom.children[3].children[0].props.class = 'flex justify-center aligin-center'
console.log(newVdom)

let diffs = diff(vdom, newVdom)
console.log(diffs)
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



node = patch(node, node, vdom, diffs)
console.log(node)