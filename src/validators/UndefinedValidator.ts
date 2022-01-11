import Locator from "../classes/Locator"
import Validator from "../classes/Validator"
import { iValidationResult } from ".."

export default class UndefinedValidator<
	T extends undefined
> extends Validator<T> {
	public constructor() {
		super()

		this.schema = `undefined`
	}

	public validate(data: any, locator: Locator): iValidationResult<T> {
		if (data !== undefined) {
			return this.failure(locator, Validator.WRONG_VALUE, this, data)
		}

		return this.success(data)
	}
}
