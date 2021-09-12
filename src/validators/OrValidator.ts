import Validator from "../classes/Validator"
import Reporter from "../classes/Reporter"

export default class OrValidator extends Validator {
	public static not_among_patterns = `Expected value to match at least one of the given patterns: %patterns%`
	private readonly validators: Validator[]

	public constructor(validators: Validator[]) {
		super()

		this.validators = validators
		this.schema = validators.map(validator => validator.schema).join(" | ")
	}

	public validate(data: any, reporter: Reporter): boolean {
		if (this.validators.length < 1) {
			reporter.throw(
				`Expected developer to provide at least 1 pattern for the OR operation`
			)
		}

		for (const validator of this.validators) {
			if (validator.validate(data, reporter.silence())) return true
		}

		return reporter.complain(
			this.replaceText(OrValidator.not_among_patterns, {
				patterns: this.validators.map(validator => validator.formatSchema()).join(" | ")
			})
		)
	}

}