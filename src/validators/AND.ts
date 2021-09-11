import { iPattern } from "../index"

/**
 * Checks if next parameter matches all of the patterns here
 * @param patterns List of patterns to compare with
 */
export default function AND(...patterns: iPattern[]): iPattern {
	return data => reporter => {
		if (patterns.length < 1) {
			reporter.throw(
				`Expected developer to provide at least 1 pattern for the AND operation`
			)
		}

		let _return = true
		for (const pattern of patterns) {
			if (!pattern(data)(reporter)) _return = false
		}

		return _return
	}
}
