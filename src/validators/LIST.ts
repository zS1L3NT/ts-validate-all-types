import { iPattern, OR } from "../index"

/**
 * Checks if next parameter is exactly the same as one of the passed patterns here
 * If no parameter passed, checks if next parameter is of type 'list'
 * @param patterns Pattern
 */
export default function LIST(...patterns: iPattern[]): iPattern {
	return data => reporter => {
		if (!Array.isArray(data)) {
			return reporter.complain(
				`Expected (${reporter.getStack()}) to be of type \`array\``
			)
		}

		if (patterns.length === 0) return true

		let _return = true
		for (const i in Array(data.length).fill(0)) {
			const stacked_reporter = reporter.setStack(`[${i}]`)
			if (!OR(...patterns)(data[i])(stacked_reporter.silence())) {
				_return = stacked_reporter.complain(
					`Expected [${i}] to be of pattern defined`
				)
			}
		}

		return _return
	}
}