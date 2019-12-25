/**
 * @name VPatch
 * @see diff方法内如果是vdom节点，将vdom也放进对应的patch中，方便最终更新时遍历对比
 */
export default class VPatch {
  constructor (vdom, patch) {
    this.vdom = vdom
    this.patch = patch
  }
}