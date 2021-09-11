import { iPattern } from "../index"

/**
 * Checks if next parameter is exactly the same as one of the passed numbers here
 * If no parameter passed, checks if next parameter is of type 'number'
 * @param pattern_object Pattern
 */
export default function OBJECT(pattern_object?: {
	[property: string]: iPattern
}): iPattern {
	return data => (reporter, silent) => {
		if (typeof data !== "object" || Array.isArray(data) || data === null) {
			return reporter.complain(
				`Expected (${data}) to be of type \`object\``,
				silent
			)
		}

		if (!pattern_object) return true

		const pattern_keys = Object.keys(pattern_object)
		const data_keys = Object.keys(data)

		for (const pattern_key of pattern_keys) {
			const key_can_be_undefined = pattern_object[pattern_key]!(undefined)(
				reporter.setStack(pattern_key),
				true
			)

			if (!data_keys.includes(pattern_key) && !key_can_be_undefined) {
				return reporter.complain(
					`Expected (${reporter.getStack()}) to contain property (${pattern_key})`,
					silent
				)
			}
		}

		for (const data_key of data_keys) {
			const stacked_reporter = reporter.setStack(data_key)
			const value = data[data_key]
			const pattern = pattern_object[data_key]

			if (!pattern) {
				return stacked_reporter.complain(
					`No type definitions for (${data_key})`,
					silent
				)
			}

			if (!pattern(value)(stacked_reporter, silent)) {
				return stacked_reporter.complain(
					`Property (${data_key}) doesn't match the defined data type`,
					silent
				)
			}
		}

		return true
	}
}