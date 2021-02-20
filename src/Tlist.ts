import { ITpattern } from "."
import Reporter from "./Reporter"

/**
 * & Type for a list
 */
export type ITlist = (item: any) => (reporter: Reporter) => boolean
/**
 * Checks if next parameter is exactly the same as one of the passed patterns here
 * If no parameter passed, checks if next parameter is of type 'list'
 * @param pattern Pattern
 */
export default function Tlist(...pattern: ITpattern[]): ITlist {
	// * pattern: ITpattern[]
	if (pattern.length === 0) {
		// Undefined params in array
		return item => reporter => {
			const isArray_ = Array.isArray(item)
			if (!isArray_)
				reporter.complain(
					`Expected (${reporter.getStack()}) to be of type \`array\``
				)
			return isArray_
		}
	}

	// * pattern: ITpattern[1++]
	return items => reporter => {
		const isArray_ = Array.isArray(items)
		if (!isArray_) {
			reporter.complain(
				`Expected (${reporter.getStack()}) to be of type \`array\``
			)
			return false
		}

		let hasError = false
		for (let i = 0, il = items.length; i < il; i++) {
			const item = items[i]
			let fulfilled = false
			for (let j = 0, jl = pattern.length; j < jl; j++) {
				const patt = pattern[j]
				// * patt: ITstring | ITnumber | ITboolean
				if (patt(item)(reporter.mute().setStack(`[${i}]`))) {
					fulfilled = true
					break
				}
			}

			if (!fulfilled) {
				reporter
					.unmute()
					.setStack(`[${i}]`)
					.complain(`Expected [${i}] to be of pattern defined`)
				hasError = true
			}
		}

		return !hasError
	}
}
