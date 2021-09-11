import { iPattern } from "../index"

/**
 * Checks if next parameter does not match the pattern here
 * @param pattern Pattern to compare with
 */
export default function NOT(pattern: iPattern): iPattern {
	return data => reporter => {
		if (pattern(data)(reporter.silence())) {
			return reporter.complain(
				`Expected (${reporter.getStack()}) to not match the given pattern`
			)
		}

		return true
	}
}
