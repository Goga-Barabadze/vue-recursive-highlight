import { bench, describe, expect } from "vitest"
import { ConfigItem } from "../../src/model/Config"
import { Fragment } from "../../src/model/Fragment"
import FragmentsUtils from "../../src/utils/fragments"

describe("short text", () => {
  bench("string", () => {
    const config = new ConfigItem({ string: "lorem" }, {})
    expect(FragmentsUtils.turnIntoFragments("lorem ipsum", [config])).toStrictEqual([
      new Fragment(config, "lorem", 0, 5),
      new Fragment(new ConfigItem(), " ipsum", 5, 11),
    ])
  })

  bench("regex", () => {
    const config = new ConfigItem({ regex: /lorem/ }, {})
    expect(FragmentsUtils.turnIntoFragments("lorem ipsum", [config])).toStrictEqual([
      new Fragment(config, "lorem", 0, 5),
      new Fragment(new ConfigItem(), " ipsum", 5, 11),
    ])
  })

  bench("range", () => {
    const config = new ConfigItem({ range: [0, 5] }, {})
    expect(FragmentsUtils.turnIntoFragments("lorem ipsum", [config])).toStrictEqual([
      new Fragment(config, "lorem", 0, 5),
      new Fragment(new ConfigItem(), " ipsum", 5, 11),
    ])
  })
})
