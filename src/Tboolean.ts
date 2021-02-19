import Reporter from "./Reporter"

/**
 * & Type for a boolean
 */
export type ITboolean = (item: any) => (reporter: Reporter) => boolean
/**
 * Checks if next parameter is of type 'boolean'
 */
export default function Tboolean(): ITboolean {
	return item => reporter => {
		const type_ = typeof item === "boolean"
		if (!type_) reporter.complain(`Expected (${reporter.getStack()}) to be of type \`boolean\``)
		return type_
	}
}
