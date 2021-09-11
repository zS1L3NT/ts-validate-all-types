import { iPattern } from "../index"

/**
 * Checks if next parameter is of type 'undefined'
 */
export default function UNDEFINED(): iPattern {
	return data => reporter => {
		if (data !== undefined) {
			return reporter.complain(
				`Expected (${reporter.getStack()}) to be of type \`undefined\``
			)
		}

		return true
	}
}
