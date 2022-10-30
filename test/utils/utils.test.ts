import { describe, expect, it } from "vitest"
import { firstNonNull } from "../../src/utils/utils"

describe("utils", () => {
  describe("firstNonNull", () => {
    it("at the start", () => {
      expect(firstNonNull(true, null, false)).toBe(true)
    })
    it("at the end", () => {
      expect(firstNonNull(null, null, 101)).toBe(101)
    })
    it("in the middle", () => {
      expect(firstNonNull(null, { key: "value" }, null)).toStrictEqual({ key: "value" })
    })
    it("treat null and undefined the same", () => {
      expect(firstNonNull(undefined, null, 101)).toBe(101)
    })
    it("return null if everything is undefined", () => {
      expect(firstNonNull(null, null, null)).toBe(undefined)
    })
  })
})