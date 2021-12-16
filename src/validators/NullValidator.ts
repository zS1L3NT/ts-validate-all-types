import Reporter from "../classes/Reporter"
import Validator from "../classes/Validator"

export default class NullValidator extends Validator {
	public constructor() {
		super()

		this.schema = `null`
	}

	public validate(data: any, reporter: Reporter): boolean {
		if (data !== null) {
			return reporter.complain(
				this.replaceText(Validator.not_value, {
					type: `null`
				})
			)
		}

		return true
	}
}
