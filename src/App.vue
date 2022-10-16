<script setup lang="ts">

import { Directive, DirectiveBinding } from "vue"
import { Config, ConfigItem } from "./model/Config"
import FragmentUtils from "./utils/fragments"
import { Fragment } from "./model/Fragment"
import { setAttributesOnElement } from "./utils/element"
import { useFps } from "@vueuse/core"

const vHighlight: Directive = {
  mounted: (element: HTMLElement, binding: DirectiveBinding<Config>) => {
    element.childNodes.forEach((value) => {
      if (!value.nodeValue) {
        return
      }

      const wrap = document.createElement("span")
      FragmentUtils.turnIntoFragments(value.nodeValue, binding.value).forEach((fragment: Fragment) => {
        const spanNode = document.createElement("span")
        spanNode.innerText = fragment.string
        setAttributesOnElement(spanNode, fragment.config)

        wrap.appendChild(spanNode)
      })

      value.replaceWith(wrap)
    })
  }
}



const config = [
  new ConfigItem({ regex: 	/\w+/ }, { class: "red" }),
  new ConfigItem({ string: 	"love" }),
]

const fps = useFps()

</script>

<template>

  {{ fps }}

  <div v-highlight="config">
    hello
  </div>
</template>

<style scoped>
* :deep(.red) {
  color: red;
}
* :deep(.blue) {
  color: blue;
}

* :deep(.green) {
  color: green;
}
</style>