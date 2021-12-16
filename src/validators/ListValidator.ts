import Reporter from "../classes/Reporter"
import Validator from "../classes/Validator"
import { iValidationResult, OR } from "../index"

export default class ListValidator<T> extends Validator<T[]> {
	private readonly validators: Validator<T>[]

	public constructor(validators: Validator<T>[]) {
		super()

		this.validators = validators
		if (validators.length === 0) {
			this.schema = `any[]`
		} else {
			this.schema = `(${validators
				.map(validator => validator.schema)
				.join(" | ")})[]`
		}
	}
	public validate(data: any, reporter: Reporter): iValidationResult<T[]> {
		if (!Array.isArray(data)) {
			return reporter.complain(
				this.replaceText(Validator.not_type, {
					type: `array`
				})
			)
		}

		if (this.validators.length === 0) return this.success(data as T[])

		let _return = this.success(data as T[])
		for (const i in Array(data.length).fill(0)) {
			const stacked_reporter = reporter.setStack(`[${i}]`)
			const validator = OR(...this.validators)

			if (!validator.validate(data[i], stacked_reporter.silence()).success) {
				_return = stacked_reporter.complain(
					this.replaceText(Validator.not_type, {
						type: validator.formatSchema()
					})
				)
			}
		}

		return _return
	}
}
