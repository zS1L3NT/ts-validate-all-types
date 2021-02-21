import { ITpattern } from "."
import Reporter from "./Reporter"

/**
 * & Type for AND operation
 */
export type ITand = (item: any) => (reporter: Reporter) => boolean
/**
 * Checks if next parameter matches all of the patterns here
 * @param patterns List of patterns to compare with
 */
export default function Tand(...patterns: ITpattern[]): ITand {
	return item => reporter => {
		let hasError = false

		if (patterns.length === 0) {
			reporter.complain(
				`Expected developer to provide at least 1 pattern for the AND operation`
			)
			return false
		}

		for (let i = 0, il = patterns.length; i < il; i++) {
			const pattern = patterns[i]
			const result = pattern(item)(reporter)

			if (!result) hasError = true
		}

		return !hasError
	}
}
