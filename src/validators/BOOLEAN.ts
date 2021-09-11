import { iPattern } from "../index"

/**
 * Checks if next parameter is exactly the same as the boolean passed here
 * If no parameter passed, checks if next parameter is of type 'boolean'
 */
export default function BOOLEAN(boolean?: boolean): iPattern {
	return data => (reporter, silent) => {
		if (typeof data !== "boolean") {
			return reporter.complain(
				`Expected (${reporter.getStack()}) to be of type \`boolean\``,
				silent
			)
		}

		if (boolean !== undefined && data !== boolean) {
			return reporter.complain(
				`Expected (${reporter.getStack()}) to be \`${boolean}\``,
				silent
			)
		}

		return true
	}
}
