import Locator from "../classes/Locator"
import Validator from "../classes/Validator"
import { iValidationResult } from ".."

export default class BooleanValidator<T extends boolean> extends Validator<T> {
	private readonly boolean?: T

	public constructor(boolean?: T) {
		super()

		this.boolean = boolean
		if (boolean !== undefined) {
			this.schema = `{"$type":"boolean","$value":${boolean}}`
		} else {
			this.schema = `{"$type":"boolean"}`
		}
	}

	public validate(data: any, locator: Locator): iValidationResult<T> {
		if (typeof data !== "boolean") {
			return this.failure(locator, Validator.WRONG_TYPE, this, data)
		}

		if (this.boolean !== undefined && data !== this.boolean) {
			return this.failure(locator, Validator.WRONG_VALUE, this, data)
		}

		return this.success(data as T)
	}
}
