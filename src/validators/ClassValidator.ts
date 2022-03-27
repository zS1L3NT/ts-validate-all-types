import Locator from "../classes/Locator"
import Validator from "../classes/Validator"
import { iValidationResult } from ".."

export default class ClassValidator<
	T extends new () => any
> extends Validator<T> {
	public static readonly NOT_INSTANCE = `Value isn't an instance of the defined class`
	private readonly clazz: T

	public constructor(clazz: T) {
		super()

		this.clazz = clazz
		this.schema = `"<class::${clazz.name}>"`
	}

	public validate(data: any, locator: Locator): iValidationResult<T> {
		if (data instanceof this.clazz) {
			return this.success(data)
		} else {
			return this.failure(
				locator,
				ClassValidator.NOT_INSTANCE,
				this,
				data
			)
		}
	}
}
