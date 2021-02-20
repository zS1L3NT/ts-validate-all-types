import { ITpattern } from "."
import Reporter from "./Reporter"

/**
 * & Type for an object
 */
export type ITobject = (item: any) => (reporter: Reporter) => boolean
/**
 * Checks if next parameter is exactly the same as one of the passed numbers here
 * If no parameter passed, checks if next parameter is of type 'number'
 * @param pattern Pattern
 */
export default function Tobject(pattern?: {
	[property: string]: ITpattern | undefined
}): ITobject {
	return item => reporter => {
		const type_ = typeof item === "object"
		if (!type_) {
			reporter.complain(`Expected (${item}) to be of type \`object\``)
			return false
		}

		if (!pattern) return true

		const patternKeys = Object.keys(pattern)
		const keys = Object.keys(item)

		let hasError = false
		for (let i = 0, il = patternKeys.length; i < il; i++) {
			const patternKey = patternKeys[i]
			const indexOf_ = keys.indexOf(patternKey) >= 0
			if (!indexOf_) {
				reporter.complain(
					`Expected (${reporter.getStack()}) to contain property (${patternKey})`
				)
				hasError = true
			}
		}

		for (let i = 0, il = keys.length; i < il; i++) {
			const key = keys[i]
			const value = item[key]
			const patt = pattern[key]

			if (!patt) {
				reporter
					.setStack(key)
					.complain(`No type definitions for (${key})`)
				hasError = true
				continue
			}

			const type_ = patt(value)(reporter.setStack(key))
			if (!type_) hasError = true
		}

		return !hasError
	}
}
