import { iPattern } from "../index"

/**
 * Checks if next parameter is exactly the same as one of the passed numbers here
 * If no parameter passed, checks if next parameter is of type 'number'
 * @param pattern_object Pattern
 */
export default function OBJECT(pattern_object?: {
	[property: string]: iPattern
}): iPattern {
	return data => reporter => {
		if (typeof data !== "object" || Array.isArray(data) || data === null) {
			return reporter.complain(
				`Expected (${data}) to be of type \`object\``
			)
		}

		if (!pattern_object) return true

		const pattern_keys = Object.keys(pattern_object)
		const data_keys = Object.keys(data)

		let _return = true
		for (const pattern_key of pattern_keys) {
			const pattern_rejects_undefined = !pattern_object[pattern_key](undefined)(reporter.silence())

			if (!data_keys.includes(pattern_key) && pattern_rejects_undefined) {
				_return = reporter.complain(
					`Expected (${reporter.getStack()}) to contain property (${pattern_key})`
				)
			}
		}

		for (const data_key of data_keys) {
			const stacked_reporter = reporter.setStack(data_key)
			const pattern = pattern_object[data_key]
			const value = data[data_key]

			if (!pattern) {
				_return = stacked_reporter.complain(
					`No type definitions for (${data_key})`
				)
				continue
			}

			if (!pattern(value)(stacked_reporter.silence())) {
				_return = stacked_reporter.complain(
					`Property (${data_key}) doesn't match the defined data type`
				)
			}
		}

		return _return
	}
}