import Locator from "../classes/Locator"
import Validator from "../classes/Validator"
import { iValidationResult } from ".."

export default class StringValidator<
	T extends string | RegExp
> extends Validator<T> {
	public static readonly NO_REGEX_MATCH = `Value does not match the defined RegExp pattern`
	public static readonly NOT_AMONG_STRINGS = `Value doesn't match anything in the defined set of strings`
	private readonly rules: T[]

	public constructor(rules: T[]) {
		super()

		this.rules = rules
		if (rules.length === 0) {
			this.schema = `string`
		} else {
			this.schema = rules
				.map(rule =>
					rule instanceof RegExp ? rule : `"${rule}"` || `""`
				)
				.join(" | ")
		}
	}

	public validate(data: any, locator: Locator): iValidationResult<T> {
		if (typeof data !== "string") {
			return this.failure(locator, Validator.WRONG_TYPE, this, data)
		}

		if (this.rules[0] instanceof RegExp) {
			const match = data.match(this.rules[0])
				? data.match(this.rules[0])!.length > 0
				: false

			if (!match) {
				return this.failure(
					locator,
					StringValidator.NO_REGEX_MATCH,
					this,
					data
				)
			}
		} else if (this.rules.length > 0) {
			if (!this.rules.includes(data as T)) {
				return this.failure(
					locator,
					StringValidator.NOT_AMONG_STRINGS,
					this,
					data
				)
			}
		}

		return this.success(data as T)
	}
}
