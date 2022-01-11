import Reporter from "../classes/Reporter"
import Validator from "../classes/Validator"
import { iValidationResult } from "../index"

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
			return reporter.complain(Validator.WRONG_TYPE, this, data)
		}

		if (this.validators.length === 0) return this.success(data as T[])

		let result = this.success(data as T[])
		for (const i in Array(data.length).fill(0)) {
			const stackedReporter = reporter.setStack(`[${i}]`)

			const results = this.validators.map(validator =>
				validator.validate(data[i], stackedReporter)
			)
			if (results.every(r => !r.success)) {
				result = {
					success: false,
					errors: [
						...result.errors,
						...results.map(r => r.errors).flat()
					],
					data: undefined
				}
			}
		}

		return result
	}
}
