import Reporter from "../classes/Reporter"
import UndefinedValidator from "./UndefinedValidator"
import Validator from "../classes/Validator"
import { iValidationResult } from ".."

export default class ObjectValidator<T> extends Validator<T> {
	public static MISSING_PROPERTY = `Object requires this property but is missing`
	public static UNKNOWN_PROPERTY = `Object has unknown property which is defined`
	private readonly rule_object?: { [property: string]: Validator<T> }

	public constructor(rule_object?: { [property: string]: Validator<T> }) {
		super()

		this.rule_object = rule_object
		if (rule_object) {
			if (Object.keys(rule_object).length === 0) {
				this.schema = `{}`
			} else {
				this.schema = `{`
				for (const rule_key in rule_object) {
					const rule_value = rule_object[rule_key]
					this.schema += `${rule_key}:${rule_value.schema},`
				}
				this.schema += `}`
			}
		} else {
			this.schema = `{\n`
			this.schema += `[property: string]: any\n`
			this.schema += `}`
		}
	}

	public validate(data: any, reporter: Reporter): iValidationResult<T> {
		if (typeof data !== "object" || Array.isArray(data) || data === null) {
			return reporter.complain(Validator.WRONG_TYPE, this, data)
		}

		if (!this.rule_object) return this.success(data)

		let _return = this.success(data)
		for (const [rule_key, rule_value] of Object.entries(this.rule_object)) {
			const stacked_reporter = reporter.setStack(rule_key)
			const rule_rejects_undefined = !rule_value.validate(
				undefined,
				stacked_reporter.silence()
			).success

			if (
				!Object.keys(data).includes(rule_key) &&
				rule_rejects_undefined
			) {
				_return = stacked_reporter.complain(
					ObjectValidator.MISSING_PROPERTY,
					rule_value,
					data
				)
			}
		}

		for (const [data_key, data_value] of Object.entries(data)) {
			const stacked_reporter = reporter.setStack(data_key)
			const rule = this.rule_object[data_key]

			if (!rule) {
				_return = stacked_reporter.complain(
					ObjectValidator.UNKNOWN_PROPERTY,
					new UndefinedValidator(),
					data
				)
				continue
			}

			if (
				!rule.validate(data_value, stacked_reporter.silence()).success
			) {
				_return = stacked_reporter.complain(
					Validator.WRONG_TYPE,
					rule,
					data
				)
			}
		}

		return _return
	}
}
