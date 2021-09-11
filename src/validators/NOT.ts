import { iPattern } from "../index"

/**
 * Checks if next parameter does not match the pattern here
 * @param pattern Pattern to compare with
 */
export default function NOT(pattern: iPattern): iPattern {
	return data => (reporter, silent) => {
		if (pattern(data)(reporter, true)) {
			return reporter.complain(
				`Expected (${reporter.getStack()}) to not match the given pattern`,
				silent
			)
		}

		return true
	}
}
