import { HTMLTag } from "./Types"

export type Config = ConfigItem []

export class ConfigItem {
  selector: Selector [] = []
  modifier?: Modifier

  constructor(selector?: Selector | Selector [], modifier?: Modifier) {
    if (Array.isArray(selector)) {
      this.selector = selector
    } else {
      this.selector = selector ? [selector] : []
    }

    this.modifier = modifier
  }
}

export class Modifier {
  /**
     * If you want to apply styles by classes, you need to either use unscoped styles or the `:deep(...)` selector.
     *
     * Example: `* :deep(.btn-primary) { color: blue }`
     */
  class?: string
  style?: string
  // props?: (RawProps & P) TODO: Allow all props to be passed
  component?: Record<string, unknown>
  tag?: HTMLTag
}

export class Selector {
  range?: [number, number]
  string?: string
  regex?: RegExp
}