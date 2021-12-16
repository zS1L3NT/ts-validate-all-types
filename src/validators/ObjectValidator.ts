import Reporter from "../classes/Reporter"
import Validator from "../classes/Validator"

export default class ObjectValidator<
	T extends { [property: string]: Validator }
> extends Validator {
	public static missing_property = `Expected value to contain property: %property%`
	public static unknown_property = `Value has unknown property: %property%`
	private readonly rule_object?: T

	public constructor(rule_object?: T) {
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

	public validate(data: any, reporter: Reporter): boolean {
		if (typeof data !== "object" || Array.isArray(data) || data === null) {
			return reporter.complain(
				this.replaceText(Validator.not_type, {
					type: `object`
				})
			)
		}

		if (!this.rule_object) return true

		let _return = true
		for (const [rule_key, rule_value] of Object.entries(this.rule_object)) {
			const rule_rejects_undefined = !rule_value.validate(
				undefined,
				reporter.silence()
			)

			if (
				!Object.keys(data).includes(rule_key) &&
				rule_rejects_undefined
			) {
				_return = reporter.complain(
					this.replaceText(ObjectValidator.missing_property, {
						property: rule_key
					})
				)
			}
		}

		for (const [data_key, data_value] of Object.entries(data)) {
			const stacked_reporter = reporter.setStack(data_key)
			const rule = this.rule_object[data_key]

			if (!rule) {
				_return = reporter.complain(
					this.replaceText(ObjectValidator.unknown_property, {
						property: data_key
					})
				)
				continue
			}

			if (!rule.validate(data_value, stacked_reporter.silence())) {
				_return = stacked_reporter.complain(
					this.replaceText(Validator.not_type, {
						type: data_key
					})
				)
			}
		}

		return _return
	}
}
