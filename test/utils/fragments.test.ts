import { describe, expect, it } from "vitest"
import { ConfigItem } from "../../src/model/Config"
import { Fragment } from "../../src/model/Fragment"
import FragmentsUtils from "../../src/utils/fragments"

describe("turnIntoFragments", () => {
  it.each([
    ["love is wise, hatred is foolish", 31],
    ["Liebe ist weise, Hass ist töricht", 33],
    ["სიყვარული ბრძენია, სიძულვილი სისულელეა", 38],
    ["爱是明智的，仇恨是愚蠢的", 12],
  ])("return single fragment when selectors do not match", (string, end) => {
    expect(FragmentsUtils.turnIntoFragments(string, [])).toStrictEqual([
      new Fragment(new ConfigItem(), string, 0, end),
    ])
  })

  it.each([
    ["love is wise, hatred is foolish", "love", " is wise, hatred is foolish", 4, 31],
    ["Liebe ist weise, Hass ist töricht", "Liebe", " ist weise, Hass ist töricht", 	5, 33],
    ["სიყვარული ბრძენია, სიძულვილი სისულელეა", "სიყვარული", " ბრძენია, სიძულვილი სისულელეა", 9, 38],
    ["爱是明智的，仇恨是愚蠢的", "爱是明智的", "，仇恨是愚蠢的",	5, 12],
  ])("match with string", (text, match, unmatched, delimiter, end) => {
    const config = new ConfigItem({ string: match }, {})
    expect(FragmentsUtils.turnIntoFragments(text, [config])).toStrictEqual([
      new Fragment(config, match, 0, delimiter),
      new Fragment(new ConfigItem(), unmatched, delimiter, end),
    ])
  })

  it.each([
    ["love is wise, hatred is foolish", "love", " is wise, hatred is foolish", 4, 31],
    ["Liebe ist weise, Hass ist töricht", "Liebe", " ist weise, Hass ist töricht", 5, 33],
    ["სიყვარული ბრძენია, სიძულვილი სისულელეა", 	"სიყვარული", 	" ბრძენია, სიძულვილი სისულელეა", 	9, 38],
    ["爱是明智的，仇恨是愚蠢的", "爱是明智的", "，仇恨是愚蠢的", 5, 12],
  ])("match with regex", (text, match, unmatched, delimiter, end) => {
    const config = new ConfigItem({ regex: new RegExp(match) }, {})
    expect(FragmentsUtils.turnIntoFragments(text, [config])).toStrictEqual([
      new Fragment(config, match, 0, delimiter),
      new Fragment(new ConfigItem(), unmatched, delimiter, end),
    ])
  })

  it.each([
    ["love is wise, hatred is foolish","love", [0, 4], " is wise, hatred is foolish", 4, 31],
    ["Liebe ist weise, Hass ist töricht", "Liebe", [0, 5], " ist weise, Hass ist töricht", 5, 33],
    ["სიყვარული ბრძენია, სიძულვილი სისულელეა", 	"სიყვარული", 	[0, 9], " ბრძენია, სიძულვილი სისულელეა", 	9, 38],
    ["爱是明智的，仇恨是愚蠢的", "爱是明智的", [0, 5], "，仇恨是愚蠢的", 5, 12],
  ])("match with range", (text, match, range, unmatched, delimiter, end) => {
    const config = new ConfigItem({ range: range as [number, number] }, {})
    expect(FragmentsUtils.turnIntoFragments(text, [config])).toStrictEqual([
      new Fragment(config, match, 0, delimiter),
      new Fragment(new ConfigItem(), unmatched, delimiter, end),
    ])
  })

  it("throw exception when selector is defined but has no properties set", () => {
    expect(() =>
      FragmentsUtils.turnIntoFragments("lorem ipsum", [new ConfigItem({})])
    ).toThrowError("You must provide at least one selector for each config item.")
  })

  it("combine selectors", () => {
    const config = [
      new ConfigItem({ string: 	"love" }),
      new ConfigItem({ regex: 	/wise/ }),
      new ConfigItem({ range: 	[21, 24] }),
    ]
    expect(FragmentsUtils.turnIntoFragments("love is wise, hatred is foolish", config)).toStrictEqual([
      new Fragment(config[0] as ConfigItem, "love", 0, 4),
      new Fragment(new ConfigItem(), " is ", 4, 8),
      new Fragment(config[1] as ConfigItem, "wise", 8, 12),
      new Fragment(new ConfigItem(), ", hatred ",12, 21),
      new Fragment(config[2] as ConfigItem, "is ", 21, 24),
      new Fragment(new ConfigItem(), "foolish", 24, 31),
    ])
  })

  it("fragments are always sorted by their start index", () => {
    const config = [
      new ConfigItem({ range: 	[21, 24] }),
      new ConfigItem({ regex: 	/wise/ }),
      new ConfigItem({ string: 	"love" }),
    ]
    expect(FragmentsUtils.turnIntoFragments("love is wise, hatred is foolish", config)).toStrictEqual([
      new Fragment(config[2] as ConfigItem, "love", 0, 4),
      new Fragment(new ConfigItem(), " is ", 4, 8),
      new Fragment(config[1] as ConfigItem, "wise", 8, 12),
      new Fragment(new ConfigItem(), ", hatred ",12, 21),
      new Fragment(config[0] as ConfigItem, "is ", 21, 24),
      new Fragment(new ConfigItem(), "foolish", 24, 31),
    ])
  })

  it("match regex numbers", () => {
    const config = new ConfigItem({ regex: /\d+/ }, {})
    expect(FragmentsUtils.turnIntoFragments("12345 7687678", [config])).toStrictEqual([
      new Fragment(config, "12345", 0, 5),
      new Fragment(new ConfigItem(), " ", 5, 6),
      new Fragment(config, "7687678", 6, 13),
    ])
  })

  it("match regex numbers", () => {
    const config = new ConfigItem({ regex: /\w+/ }, {})
    expect(FragmentsUtils.turnIntoFragments("hello world!", [config])).toStrictEqual([
      new Fragment(config, "hello", 0, 5),
      new Fragment(new ConfigItem(), " ", 5, 6),
      new Fragment(config, "world", 6, 11),
      new Fragment(new ConfigItem(), "!", 11, 12),
    ])
  })

  it("set modifiers", () => {
    const config = new ConfigItem({ regex: /\w+/ }, { props: { class: "class-1" } })
    expect(FragmentsUtils.turnIntoFragments("hello world!", [config])).toStrictEqual([
      new Fragment(config, "hello", 0, 5),
      new Fragment(new ConfigItem(), " ", 5, 6),
      new Fragment(config, "world", 6, 11),
      new Fragment(new ConfigItem(), "!", 11, 12),
    ])
  })

  it("throw error if range is outside the bounds", () => {
    const config = new ConfigItem({ range: [99999, 9999999] })
    expect(() => FragmentsUtils.turnIntoFragments("hello world!", [config]))
      .toThrowError(/The provided range is invalid/)
  })

  describe("overlapping matches", () => {
    it.skip("fragment with multiple configs", () => {
      const config = [
        new ConfigItem({ string: "love" }, { props: { class: "love-class" } }),
        new ConfigItem({ regex: /\w+/ }, { props: { class: "word-class" } }),
      ]
      expect(FragmentsUtils.turnIntoFragments("love is wise", config)).toStrictEqual([
        new Fragment(config, "love", 0, 5),
        new Fragment(new ConfigItem(), " ", 5, 6),
        new Fragment(config[1] as ConfigItem, "is", 6, 8),
        new Fragment(new ConfigItem(), " ", 8, 9),
        new Fragment(config[1] as ConfigItem, "wise", 9, 13),
      ])
    })
  })
})
