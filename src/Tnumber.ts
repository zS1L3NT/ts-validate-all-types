import Reporter from "./Reporter"

/**
 * & Type for a number
 */
export type ITnumber = (item: any) => (reporter: Reporter) => boolean
/**
 * Checks if next parameter is exactly the same as one of the passed patterns here
 * If no parameter passed, checks if next parameter is of type 'number'
 * @param pattern Pattern
 */
export default function Tnumber(...pattern: number[]): ITnumber {
	// * pattern: number[]
	if (pattern.length > 0) {
		// Single number or many numbers
		return item => reporter => {
			const type_ = typeof item === "number"
			const indexOf_ = pattern.indexOf(item) >= 0
			if (!type_)
				reporter.complain(`Expected (${reporter.getStack()}) to be of type \`number\``)
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
		const type_ = typeof item === "number"
		if (!type_)
			reporter.complain(`Expected (${reporter.getStack()}) to be of type \`number\``)
		return type_
	}
}
