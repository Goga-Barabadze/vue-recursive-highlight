<script setup lang="ts">
import { Config, ConfigItem } from "./model/Config"
import { Directive, DirectiveBinding } from "vue"
import updateDOM from "./utils/traverse"

const vHighlight: Directive = {
  mounted: (element: HTMLElement, binding: DirectiveBinding<Config>) => {
    updateDOM(element, binding.value)
  },
}

const config = [
  new ConfigItem({ regex: /\w+/ }, { tag: "span", props: { style: "color: red" } }),
]
</script>

<template>
  <story :layout="{type: 'grid'}">
    <div v-highlight="config">
      <code>
        <input type="button" value="hello" some-stuff @click="console.log()">
      </code>
    </div>
  </story>
</template>

<style>
* :deep(.red) {
  background: #8ac926;
  color: white;
  padding: 5px 5px 5px 5px;
  border-radius: 4px;
  cursor: pointer;
}
* :deep(.red):hover {
  background: rgba(138, 201, 38, 0.8);
}
</style>