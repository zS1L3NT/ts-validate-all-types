import { iPattern } from "../index"

/**
 * Checks if next parameter is exactly the same as one of the passed patterns here
 * If no parameter passed, checks if next parameter is of type 'string'
 * @param patterns Strings
 */
export default function STRING(...patterns: string[]): iPattern
/**
 * Checks if next parameter matches the passed RegExp here
 * @param patterns Pattern
 */
export default function STRING(patterns: RegExp): iPattern
/**
 *
 * @param patterns Unaccepted types
 */
export default function STRING(...patterns: any[]): iPattern {
	return data => reporter => {
		if (typeof data !== "string") {
			return reporter.complain(
				`Expected (${reporter.getStack()}) to be of type \`string\``
			)
		}

		if (patterns[0] instanceof RegExp) {
			const match = data.match(patterns[0])
				? data.match(patterns[0])!.length > 0
				: false

			if (!match) {
				return reporter.complain(
					`Expected (${reporter.getStack()}) to match RegExp (${
						patterns[0]
					})`
				)
			}
		}
		else if (patterns.length > 0) {
			if (!patterns.includes(data)) {
				return reporter.complain(
					`Expected (${reporter.getStack()}) to be in (${JSON.stringify(
						patterns
					)})`
				)
			}
		}

		return true
	}
}
