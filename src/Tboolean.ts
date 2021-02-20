import Reporter from "./Reporter"

/**
 * & Type for a boolean
 */
export type ITboolean = (item: any) => (reporter: Reporter) => boolean
/**
 * Checks if next parameter is exactly the same as the boolean passed here
 * If no parameter passed, checks if next parameter is of type 'boolean'
 */
export default function Tboolean(bool?: boolean): ITboolean {
	return item => reporter => {
		const type_ = typeof item === "boolean"
		if (!type_) {
			reporter.complain(
				`Expected (${reporter.getStack()}) to be of type \`boolean\``
			)
			return false
		}
		if (bool && item !== bool) {
			reporter.complain(
				`Expected (${reporter.getStack()}) to be \`${bool}\``
			)
			return false
		}
		return true
	}
}
