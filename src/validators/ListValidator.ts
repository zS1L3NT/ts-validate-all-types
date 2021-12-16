import Reporter from "../classes/Reporter"
import Validator from "../classes/Validator"
import { OR } from "../index"

export default class ListValidator<V extends Validator[]> extends Validator {
	private readonly validators: V

	public constructor(validators: V) {
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

	public validate(data: any, reporter: Reporter): boolean {
		if (!Array.isArray(data)) {
			return reporter.complain(
				this.replaceText(Validator.not_type, {
					type: `array`
				})
			)
		}

		if (this.validators.length === 0) return true

		let _return = true
		for (const i in Array(data.length).fill(0)) {
			const stacked_reporter = reporter.setStack(`[${i}]`)
			const validator = OR(...this.validators)

			if (!validator.validate(data[i], stacked_reporter.silence())) {
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
