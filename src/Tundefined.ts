import Reporter from "./Reporter"

/**
 * & Type for undefined
 */
export type ITundefined = (item: any) => (reporter: Reporter) => boolean
/**
 * Checks if next parameter is of type 'undefined'
 * @param pattern Pattern
 */
export default function Tundefined(): ITundefined {
	return item => reporter => {
		const type_ = typeof item === 'undefined'
		if (!type_) reporter.complain(`Expected (${reporter.getStack()}) to be of type \`undefined\``)
		return type_
	}
}
