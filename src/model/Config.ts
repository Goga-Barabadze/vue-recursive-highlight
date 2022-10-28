export type Config = ConfigItem []

type HTMLTag = "html" | "body" | "base" | "head" | "link" | "meta"
  | "style" | "title" | "address" | "article" | "aside" | "footer"
  | "header" | "hgroup" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "nav"
  | "section" | "div" | "dd" | "dl" | "dt" | "figcaption" | "figure" | "picture"
  | "hr" | "img" | "li" | "main" | "ol" | "p" | "pre" | "ul" | "a" | "b"
  | "abbr" | "bdi" | "bdo" | "br" | "cite" | "code" | "data" | "dfn" | "em"
  | "i" | "kbd" | "mark" | "q" | "rp" | "rt" | "ruby" | "s" | "samp" | "small"
  | "span" | "strong" | "sub" | "sup" | "time" | "u" | "var" | "wbr" | "area"
  | "audio" | "map" | "track" | "video" | "embed" | "object" | "param" |
  "source" | "canvas" | "script" | "noscript" | "del" | "ins" | "caption" | "col"
  | "colgroup" | "table" | "thead" | "tbody" | "td" | "th" | "tr" | "button"
  | "datalist" | "fieldset" | "form" | "input" | "label" | "legend" | "meter"
  | "optgroup" | "option" | "output" | "progress" | "select" | "textarea"
  | "details" | "dialog" | "menu" | "summary" | "template" |
  "blockquote" | "iframe" | "tfoot" | "svg" | "view"

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
  props?: Record<string, unknown>
  component?: Record<string, unknown>
  tag?: HTMLTag
}

export class Selector {
  range?: [number, number]
  string?: string
  regex?: RegExp
}