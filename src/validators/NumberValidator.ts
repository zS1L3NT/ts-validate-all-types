import Locator from "../classes/Locator"
import Validator from "../classes/Validator"
import { iValidationResult } from ".."

export default class NumberValidator<T extends number> extends Validator<T> {
	public static readonly NOT_AMONG_NUMBERS = `Value doesn't match anything in the defined set of numbers`
	private readonly numbers: T[]

	public constructor(numbers: T[]) {
		super()

		this.numbers = numbers
		if (numbers.length === 0) {
			this.schema = `"<number>"`
		} else {
			this.schema = `"(${numbers.join(" | ")})"`
		}
	}

	public validate(data: any, locator: Locator): iValidationResult<T> {
		if (typeof data !== "number") {
			return this.failure(locator, Validator.WRONG_TYPE, this, data)
		}

		if (this.numbers.length > 0) {
			if (!this.numbers.includes(data as T)) {
				return this.failure(
					locator,
					NumberValidator.NOT_AMONG_NUMBERS,
					this,
					data
				)
			}
		}

		return this.success(data as T)
	}
}
