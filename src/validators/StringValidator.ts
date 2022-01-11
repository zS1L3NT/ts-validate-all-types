import Reporter from "../classes/Reporter"
import Validator from "../classes/Validator"
import { iValidationResult } from ".."

export default class StringValidator<
	T extends string | RegExp
> extends Validator<T> {
	public static NO_REGEX_MATCH = `Value does not match the defined RegExp pattern`
	public static NOT_AMONG_STRINGS = `Value doesn't match anything in the defined set of strings`
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

	public validate(data: any, reporter: Reporter): iValidationResult<T> {
		if (typeof data !== "string") {
			return reporter.complain(Validator.WRONG_TYPE, this, data)
		}

		if (this.rules[0] instanceof RegExp) {
			const match = data.match(this.rules[0])
				? data.match(this.rules[0])!.length > 0
				: false

			if (!match) {
				return reporter.complain(
					StringValidator.NO_REGEX_MATCH,
					this,
					data
				)
			}
		} else if (this.rules.length > 0) {
			if (!this.rules.includes(data as T)) {
				return reporter.complain(
					StringValidator.NOT_AMONG_STRINGS,
					this,
					data
				)
			}
		}

		return this.success(data as T)
	}
}
