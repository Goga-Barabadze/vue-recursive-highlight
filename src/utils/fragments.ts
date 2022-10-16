import { Config, ConfigItem } from "../model/Config"
import { Fragment } from "../model/Fragment"

type MatchResult = [string, number, number]

export default class FragmentsUtils {
  static turnIntoFragments (text: string, config: Config) : Fragment [] {
    const fragments: Fragment [] = []

    config.forEach((configItem: ConfigItem) => {
      configItem.selector.forEach(selector => {
        const { range, regex, string } = selector

        if (range) {
          fragments.push(new Fragment(configItem, ...FragmentsUtils.matchByRange(range, text)))
        } else if (regex || string) {
          const flags = "g"
          const pattern: string = regex
            ? regex?.source ?? ""
            : string        ?? ""
          const newRegex = new RegExp(pattern, flags)

          for (const result of FragmentsUtils.matchByRegex(newRegex, text)) {
            fragments.push(new Fragment(configItem, ...result))
          }
        } else {
          throw new Error("You must provide at least one selector for each config item.")
        }
      })
    })

    fragments.push(...FragmentsUtils.fillTheGaps(fragments, text))

    return fragments.sort((a: Fragment, b: Fragment) => a.start - b.start)
  }

  private static matchByRange(range: [number, number], text: string): MatchResult {
    const start = range[0]
    const end 	= range[1]

    if (start < 0
      || start > text.length
      || end < start
      || end > text.length) {
      throw new Error("The provided range is invalid")
    }

    const matched = text.substring(start, end)

    return [
      matched,
      start,
      end,
    ]
  }

  private static * matchByRegex(regex: RegExp, text: string): Generator<MatchResult> {
    let match, start: number, end: number, matched: string
    while((match = regex.exec(text)) !== null && match[0]) {
      start   = match.index
      end     = start + match[0].length
      matched = match[0]

      yield [
        matched,
        start,
        end,
      ]
    }
  }

  private static fillTheGaps (fragments: Fragment [], string: string) {
    if (fragments.length === 0) {
      return [ new Fragment(new ConfigItem(), string, 0, string.length) ]
    }

    fragments.sort((a: Fragment, b: Fragment) => a.start - b.start)

    const gaps: Fragment [] = []

    let start: number | null
    let end:   number | null

    fragments.forEach((fragment: Fragment, index: number) => {
      start = fragment.end
      end   = fragments[index + 1]?.start ?? string.length

      if (start && end && start !== end) {
        const substring = string.substring(start, end)
        gaps.push(new Fragment(new ConfigItem(), substring, start, end))
      }
    })

    return gaps
  }
}