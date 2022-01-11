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

		let result = this.success(data)
		for (const [ruleKey, ruleValue] of Object.entries(this.rule_object)) {
			const stackedReporter = reporter.setStack(ruleKey)
			const ruleRejectsUndefined = !ruleValue.validate(
				undefined,
				stackedReporter.silence()
			).success

			if (!Object.keys(data).includes(ruleKey) && ruleRejectsUndefined) {
				result = stackedReporter.complain(
					ObjectValidator.MISSING_PROPERTY,
					ruleValue,
					data
				)
			}
		}

		for (const [dataKey, dataValue] of Object.entries(data)) {
			const stackedReporter = reporter.setStack(dataKey)
			const rule = this.rule_object[dataKey]

			if (!rule) {
				result = stackedReporter.complain(
					ObjectValidator.UNKNOWN_PROPERTY,
					new UndefinedValidator(),
					data
				)
				continue
			}

			if (!rule.validate(dataValue, stackedReporter.silence()).success) {
				result = stackedReporter.complain(
					Validator.WRONG_TYPE,
					rule,
					data
				)
			}
		}

		return result
	}
}
