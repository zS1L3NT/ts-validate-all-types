import { ITpattern } from "."
import Reporter from "./Reporter"

/**
 * & Type for OR operation
 */
export type ITor = (item: any) => (reporter: Reporter) => boolean
/**
 * Checks if next parameter matches at least one of the patterns here
 * @param patterns List of patterns to compare with
 */
export default function Tor(...patterns: ITpattern[]): ITor {
	return item => reporter => {
		let hasSuccess = false

		if (patterns.length === 0) {
			reporter.complain(`Expected developer to provide at least 1 pattern for the OR operation`)
			return false
		}

		for (let i = 0, il = patterns.length; i < il; i++) {
			const pattern = patterns[i]
			const result = pattern(item)(reporter.mute())

			if (result) hasSuccess = true
		}

		reporter.unmute()
		if (!hasSuccess)
			reporter.complain(
				`Expected (${reporter.getStack()}) to match at least one of the given patterns`
			)

		return hasSuccess
	}
}
