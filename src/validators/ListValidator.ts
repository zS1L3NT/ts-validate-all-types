import Locator from "../classes/Locator"
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

	public validate(data: any, locator: Locator): iValidationResult<T[]> {
		if (!Array.isArray(data)) {
			return this.failure(locator, Validator.WRONG_TYPE, this, data)
		}

		if (this.validators.length === 0) return this.success(data as T[])

		let result = this.success(data as T[])
		for (const i in Array(data.length).fill(0)) {
			const traversedLocator = locator.traverse(`[${i}]`)

			const results = this.validators.map(validator =>
				validator.validate(data[i], traversedLocator)
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
