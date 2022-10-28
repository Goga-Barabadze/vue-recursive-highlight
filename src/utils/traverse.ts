import FragmentUtils from "./fragments"
import { Fragment } from "../model/Fragment"
import { Config } from "../model/Config"
import { createApp, h, VNode } from "vue"
import { firstNonNull } from "./utils"
import { randomHex } from "./random";

function traverseAndCollectNodes (element: HTMLElement, config: Config) {
  const children: VNode [] = []
  element.childNodes.forEach((child: ChildNode) => {
    if (child.nodeName !== "#text") {
      const parentTag = firstNonNull(element?.nodeName, "span") as string

      children.push(h(parentTag, traverseAndCollectNodes(child as HTMLElement, config)))
    } else {
      const fragments = FragmentUtils.turnIntoFragments(child.nodeValue as string, config)
      fragments.forEach((fragment: Fragment) => {
        const modifier = fragment.config.at(0)?.modifier
        const tag = firstNonNull(modifier?.component, modifier?.tag, "span") as string | Record<string, unknown>
        const styles = fragment.config.map(value => value.modifier?.style)

        children.push(h(tag, { style: styles }, fragment.string))
      })
    }
  })

  return h("span", children)
}

export function updateDOM(element: HTMLElement, config: Config) {
  const tree = traverseAndCollectNodes(element, config)
  createContainer(element, tree!)
}

function createContainer (element: HTMLElement, vNode: VNode) {
  const div = document.createElement("span")

  const id = "container-" + randomHex()
  div.id = id
  element.replaceWith(div)

  createApp({
    render: () => {
      return vNode
    },
  }).mount("#" + id)
}