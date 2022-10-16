import { ConfigItem } from "./Config"

export class Fragment {
  string: string
  config: ConfigItem []
  start: number
  end: number

  constructor(configItem: ConfigItem | ConfigItem [], string: string, start: number, end: number) {
    this.config = Array.isArray(configItem) ? configItem : [configItem]
    this.string = string
    this.start = start
    this.end = end
  }
}