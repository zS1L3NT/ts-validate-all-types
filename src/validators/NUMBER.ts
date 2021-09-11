import { iPattern } from "../index"

/**
 * Checks if next parameter is exactly the same as one of the passed patterns here
 * If no parameter passed, checks if next parameter is of type 'number'
 * @param numbers Numbers
 */
export default function NUMBER(...numbers: number[]): iPattern {
	return data => reporter => {
		if (typeof data !== "number") {
			return reporter.complain(
				`Expected (${reporter.getStack()}) to be of type \`number\``
			)
		}

		if (numbers.length > 0) {
			if (!numbers.includes(data)) {
				return reporter.complain(
					`Expected (${reporter.getStack()}) to be in (${JSON.stringify(
						numbers
					)})`
				)
			}
		}

		return true
	}
}
