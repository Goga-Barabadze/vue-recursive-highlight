import { Config, ConfigItem, Modifier } from "../model/Config"

export function setAttributesOnElement(element: HTMLElement, config?: ConfigItem []) {
  config?.forEach((configItem: ConfigItem) => {
    for (const attribute in configItem.modifier) {
      if (Object.prototype.hasOwnProperty.call(configItem.modifier, attribute)) {
        element.setAttribute(attribute, configItem.modifier[attribute])
      }
    }
  })
}