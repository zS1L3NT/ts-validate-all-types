import Reporter from "../classes/Reporter"
import Validator from "../classes/Validator"
import { iValidationResult } from ".."

export default class BooleanValidator<T extends boolean> extends Validator<T> {
	private readonly boolean?: T

	public constructor(boolean?: T) {
		super()

		this.boolean = boolean
		if (boolean !== undefined) {
			this.schema = `${boolean}`
		} else {
			this.schema = `boolean`
		}
	}

	public validate(data: any, reporter: Reporter): iValidationResult<T> {
		if (typeof data !== "boolean") {
			return reporter.complain(
				this.replaceText(Validator.not_type, {
					type: `boolean`
				})
			)
		}

		if (this.boolean !== undefined && data !== this.boolean) {
			return reporter.complain(
				this.replaceText(Validator.not_value, {
					value: this.boolean
				})
			)
		}

		return this.success(data as T)
	}
}
