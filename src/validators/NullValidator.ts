import Locator from "../classes/Locator"
import Validator from "../classes/Validator"
import { iValidationResult } from ".."

export default class NullValidator<T extends null> extends Validator<T> {
	public constructor() {
		super()

		this.schema = `{"$type":"null"}`
	}

	public validate(data: any, locator: Locator): iValidationResult<T> {
		if (data !== null) {
			return this.failure(locator, Validator.WRONG_VALUE, this, data)
		}

		return this.success(data)
	}
}
