import FragmentUtils from "./fragments"
import { Fragment } from "../model/Fragment"
import { Config } from "../model/Config"
import { createApp, h, VNode } from "vue"
import { firstNonNull, mergeObjects } from "./utils"
import { randomHex } from "./random"

export default function updateDOM(element: HTMLElement, config: Config) {
  const tree = traverseAndCollectNodes(element, config)
  createContainer(element, tree!)
}

function traverseAndCollectNodes (element: HTMLElement, config: Config) {
  const children: VNode [] = []
  element.childNodes.forEach((child: ChildNode) => {
    if (child.nodeName !== "#text") {
      children.push(traverseAndCollectNodes(child as HTMLElement, config))
    } else {
      const fragments = FragmentUtils.turnIntoFragments(child.nodeValue as string, config)
      fragments.forEach((fragment: Fragment) => {
        const modifier = fragment.config.at(0)?.modifier
        const tag = firstNonNull(modifier?.component, modifier?.tag, "span") as string | Record<string, unknown>
        children.push(h(tag, mergeObjects(), fragment.string))
      })
    }
  })

  const parentTag = firstNonNull(element.nodeName, "span") as string
  return h(parentTag, children)
}

function createContainer (element: HTMLElement, vNode: VNode) {
  const div = document.createElement("span")

  const id = "v-highlight-container-" + randomHex()
  div.id = id
  element.replaceWith(div)

  createApp({
    render: () => {
      return vNode
    },
  }).mount("#" + id)
}