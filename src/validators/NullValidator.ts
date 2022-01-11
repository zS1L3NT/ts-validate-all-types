import Reporter from "../classes/Reporter"
import Validator from "../classes/Validator"
import { iValidationResult } from ".."

export default class NullValidator<T extends null> extends Validator<T> {
	public constructor() {
		super()

		this.schema = `null`
	}

	public validate(data: any, reporter: Reporter): iValidationResult<T> {
		if (data !== null) {
			return reporter.complain(Validator.WRONG_VALUE, this, data)
		}

		return this.success(data)
	}
}
