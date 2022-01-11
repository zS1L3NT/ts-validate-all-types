import Reporter from "../classes/Reporter"
import Validator from "../classes/Validator"
import { iValidationResult } from ".."

export default class UndefinedValidator<
	T extends undefined
> extends Validator<T> {
	public constructor() {
		super()

		this.schema = `undefined`
	}

	public validate(data: any, reporter: Reporter): iValidationResult<T> {
		if (data !== undefined) {
			return reporter.complain(Validator.WRONG_VALUE, this, data)
		}

		return this.success(data)
	}
}
