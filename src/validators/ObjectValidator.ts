import Validator from "../classes/Validator"
import Reporter from "../classes/Reporter"

export default class ObjectValidator extends Validator {
	public static missing_property = `Expected value to contain property: %property%`
	public static unknown_property = `Value has unknown property: %property%`
	private readonly pattern_object?: { [property: string]: Validator }

	public constructor(pattern_object?: { [property: string]: Validator }) {
		super()

		this.pattern_object = pattern_object
		if (pattern_object) {
			if (Object.keys(pattern_object).length === 0) {
				this.schema = `{}`
			}
			else {
				this.schema = `{`
				for (const pattern_key in pattern_object) {
					const pattern_value = pattern_object[pattern_key]
					this.schema += `${pattern_key}:${pattern_value.schema},`
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

		if (!this.pattern_object) return true

		let _return = true
		for (const [pattern_key, pattern_value] of Object.entries(this.pattern_object)) {
			const pattern_rejects_undefined = !pattern_value.validate(undefined, reporter.silence())

			if (!Object.keys(data).includes(pattern_key) && pattern_rejects_undefined) {
				_return = reporter.complain(
					this.replaceText(ObjectValidator.missing_property, {
						property: pattern_key
					})
				)
			}
		}

		for (const [data_key, data_value] of Object.entries(data)) {
			const stacked_reporter = reporter.setStack(data_key)
			const pattern = this.pattern_object[data_key]

			if (!pattern) {
				_return = reporter.complain(
					this.replaceText(ObjectValidator.unknown_property, {
						property: data_key
					})
				)
				continue
			}

			if (!pattern.validate(data_value, stacked_reporter.silence())) {
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