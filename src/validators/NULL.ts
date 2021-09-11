import { iPattern } from "../index"

/**
 * Checks if next parameter is of type 'null'
 * Method name is in capitals because null is a keyword
 */
export default function NULL(): iPattern {
	return data => reporter => {
		if (data !== null) {
			return reporter.complain(
				`Expected (${reporter.getStack()}) to be of type \`null\``
			)
		}

		return true
	}
}
