import { iPattern } from "../index"

/**
 * Checks if next parameter matches all of the patterns here
 * @param patterns List of patterns to compare with
 */
export default function AND(...patterns: iPattern[]): iPattern {
	return data => (reporter, silent) => {
		if (patterns.length === 0) {
			reporter.throw(`Expected developer to provide at least 1 pattern for the AND operation`)
			return false
		}

		for (const pattern of patterns) {
			if (!pattern(data)(reporter, silent)) return false
		}

		return true
	}
}
