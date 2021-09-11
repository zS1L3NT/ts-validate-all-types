import { iPattern } from "../index"

/**
 * Checks if next parameter matches at least one of the patterns here
 * @param patterns List of patterns to compare with
 */
export default function OR(...patterns: iPattern[]): iPattern {
    return data => (reporter, silent) => {
        if (patterns.length === 0) {
            reporter.throw(`Expected developer to provide at least 1 pattern for the OR operation`)
            return false
        }

        for (const pattern of patterns) {
            if (pattern(data)(reporter, true)) return true
        }

        return reporter.complain(
			`Expected (${reporter.getStack()}) to match at least one of the given patterns`,
			silent
		)
    }
}
