import Validator from "../classes/Validator"
import Reporter from "../classes/Reporter"

export default class StringValidator extends Validator {
	private readonly patterns: any[]

	public constructor(patterns: any[]) {
		super()

		this.patterns = patterns
		if (patterns.length === 0) {
			this.schema = `string`
		} else {
			this.schema = patterns.join(' | ')
		}
	}


	public validate(data: any, reporter: Reporter): boolean {
		if (typeof data !== "string") {
			return reporter.complain(
				`Expected (${reporter.getStack()}) to be of type \`string\``
			)
		}

		if (this.patterns[0] instanceof RegExp) {
			const match = data.match(this.patterns[0])
				? data.match(this.patterns[0])!.length > 0
				: false

			if (!match) {
				return reporter.complain(
					`Expected (${reporter.getStack()}) to match RegExp (${
						this.patterns[0]
					})`
				)
			}
		}
		else if (this.patterns.length > 0) {
			if (!this.patterns.includes(data)) {
				return reporter.complain(
					`Expected (${reporter.getStack()}) to be in (${JSON.stringify(
						this.patterns
					)})`
				)
			}
		}

		return true
	}

}