import Reporter from "./Reporter"

/**
 * & Type for a string
 */
export type ITstring = (item: any) => (reporter: Reporter) => boolean
/**
 * Checks if next parameter is exactly the same as one of the passed patterns here
 * If no parameter passed, checks if next parameter is of type 'string'
 * @param pattern Strings
 */
export default function Tstring(...pattern: string[]): ITstring
/**
 * Checks if next parameter matches the passed RegExp here
 * @param pattern Pattern
 */
export default function Tstring(pattern: RegExp): ITstring
/**
 *
 * @param pattern Unaccepted types
 */
export default function Tstring(...pattern: any[]): ITstring {
	// * pattern: any[]
	if (pattern[0] instanceof RegExp) {
		// Regex
		return item => reporter => {
			const type_ = typeof item === "string"
			const regex_ = item.match(pattern[0])
				? item.match(pattern[0])!.length > 0
				: false
			if (!type_)
				reporter.complain(`Expected (${reporter.getStack()}) to be of type \`string\``)
			if (!regex_)
				reporter.complain(
					`Expected (${reporter.getStack()}) to match RegExp (${pattern[0]})`
				)
			return type_ && regex_
		}
	}

	// * pattern: string[]
	if (pattern.length > 0) {
		// Single string or many strings
		return item => reporter => {
			const type_ = typeof item === "string"
			const indexOf_ = pattern.indexOf(item) >= 0
			if (!type_)
				reporter.complain(`Expected (${reporter.getStack()}) to be of type \`string\``)
			if (!indexOf_)
				reporter.complain(
					`Expected (${reporter.getStack()}) to be in (${JSON.stringify(pattern)})`
				)
			return type_ && indexOf_
		}
	}

	// * pattern: []
	// Empty
	return item => reporter => {
		const type_ = typeof item === "string"
		if (!type_)
			reporter.complain(`Expected (${reporter.getStack()}) to be of type \`string\``)
		return type_
	}
}
