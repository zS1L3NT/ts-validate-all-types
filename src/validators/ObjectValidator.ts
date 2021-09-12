import Validator from "../classes/Validator"
import Reporter from "../classes/Reporter"

export default class ObjectValidator extends Validator {
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
				`Expected (${data}) to be of type \`object\``
			)
		}

		if (!this.pattern_object) return true

		let _return = true
		for (const [pattern_key, pattern_value] of Object.entries(this.pattern_object)) {
			const pattern_rejects_undefined = !pattern_value.validate(undefined, reporter.silence())

			if (!Object.keys(data).includes(pattern_key) && pattern_rejects_undefined) {
				_return = reporter.complain(
					`Expected (${reporter.getStack()}) to contain property (${pattern_key})`
				)
			}
		}

		for (const [data_key, data_value] of Object.entries(data)) {
			const stacked_reporter = reporter.setStack(data_key)
			const pattern = this.pattern_object[data_key]

			if (!pattern) {
				_return = stacked_reporter.complain(
					`No type definitions for (${data_key})`
				)
				continue
			}

			if (!pattern.validate(data_value, stacked_reporter.silence())) {
				_return = stacked_reporter.complain(
					`Property (${data_key}) doesn't match the defined data type`
				)
			}
		}

		return _return
	}

}