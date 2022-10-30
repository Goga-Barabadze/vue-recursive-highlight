import FragmentUtils from "./fragments"
import { Fragment } from "../model/Fragment"
import { Config } from "../model/Config"
import { createApp, h, mergeProps, VNode } from "vue"
import { firstNonNull } from "./utils"
import { randomHex } from "./random"
import { ReadonlyNonNullable } from "../model/UtilityTypes"

export default function updateDOM(element: ReadonlyNonNullable<HTMLElement>, config: ReadonlyNonNullable<Config>) {
  const tree = traverseAndCollectNodes(element, config)
  createContainer(element, tree!)
}

function traverseAndCollectNodes (element: ReadonlyNonNullable<HTMLElement>, config: ReadonlyNonNullable<Config>) {
  const children: NonNullable<VNode []> = []
  element.childNodes.forEach((child: ReadonlyNonNullable<ChildNode>) => {
    if (child.nodeName !== "#text") {
      children.push(traverseAndCollectNodes(child as HTMLElement, config))
    } else {
      const fragments = FragmentUtils.turnIntoFragments(child.nodeValue as string, config)
      fragments.forEach((fragment: Fragment) => {
        const modifier = fragment.config.at(0)?.modifier
        const tag = firstNonNull(modifier?.component, modifier?.tag, "span") as string | Record<string, unknown>
        const props = fragment.config.map(config => config.modifier?.props)
          .filter(prop => prop != null) as (Record<string, unknown>)[]

        children.push(h(tag, mergeProps(...props), fragment.string))
      })
    }
  })

  const parentTag = firstNonNull(element.nodeName, "span") as string
  return h(parentTag, children)
}

function createContainer (element: ReadonlyNonNullable<HTMLElement>, vNode: ReadonlyNonNullable<VNode>) {
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