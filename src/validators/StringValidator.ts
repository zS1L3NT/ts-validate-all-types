import Validator from "../classes/Validator"
import Reporter from "../classes/Reporter"

export default class StringValidator extends Validator {
	public static not_regex_match = `Expected value to match RegExp: %regex%`
	public static not_among_strings = `Expected value to be one of the strings: %strings%`
	private readonly patterns: any[]

	public constructor(patterns: any[]) {
		super()

		this.patterns = patterns
		if (patterns.length === 0) {
			this.schema = `string`
		}
		else {
			this.schema = patterns.map(pattern => pattern || `""`).join(" | ")
		}
	}

	public validate(data: any, reporter: Reporter): boolean {
		if (typeof data !== "string") {
			return reporter.complain(
				this.replaceText(Validator.not_type, {
					type: `string`
				})
			)
		}

		if (this.patterns[0] instanceof RegExp) {
			const match = data.match(this.patterns[0])
				? data.match(this.patterns[0])!.length > 0
				: false

			if (!match) {
				return reporter.complain(
					this.replaceText(StringValidator.not_regex_match, {
						regex: this.patterns[0]
					})
				)
			}
		}
		else if (this.patterns.length > 0) {
			if (!this.patterns.includes(data)) {
				return reporter.complain(
					this.replaceText(StringValidator.not_among_strings, {
						strings: this.patterns
					})
				)
			}
		}

		return true
	}

}