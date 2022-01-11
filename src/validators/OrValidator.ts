import Reporter from "../classes/Reporter"
import Validator from "../classes/Validator"
import { iValidationResult } from ".."

export default class OrValidator<T> extends Validator<T> {
	public static NOT_AMONG_RULES = `Value does not match any of the validators defined`
	private readonly validators: Validator<T>[]

	public constructor(validators: Validator<T>[]) {
		super()

		this.validators = validators
		this.schema = validators.map(validator => validator.schema).join(" | ")
	}

	public validate(data: any, reporter: Reporter): iValidationResult<T> {
		if (this.validators.length < 1) {
			reporter.throw(
				`Expected developer to provide at least 1 rule for the OR operation`
			)
		}

		for (const validator of this.validators) {
			if (validator.validate(data, reporter.silence()).success)
				return this.success(data as T)
		}

		return reporter.complain(OrValidator.NOT_AMONG_RULES, this, data)
	}
}
