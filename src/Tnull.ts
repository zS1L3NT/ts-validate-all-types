import Reporter from "./Reporter"

/**
 * & Type for null
 */
export type ITnull = (item: any) => (reporter: Reporter) => boolean
/**
 * Checks if next parameter is of type 'null'
 * @param pattern Pattern
 */
export default function Tnull(): ITnull {
	return item => reporter => {
		const type_ = item === null
		if (!type_)
			reporter.complain(
				`Expected (${reporter.getStack()}) to be of type \`null\``
			)
		return type_
	}
}
