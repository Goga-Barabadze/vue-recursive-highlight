import { VNode } from "vue"

export function traverseNodeTree (vNode: VNode) {
  if (!vNode || !vNode.el) {
    return
  }

  if (vNode.el.nodeName === "#text") {
    return
  }

  if (typeof vNode.children === "string") {

    return
  }

  (vNode.children as []).forEach((child: VNode) => {
    traverseNodeTree(child)
  })
}