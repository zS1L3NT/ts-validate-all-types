import Validator from "../classes/Validator"
import Reporter from "../classes/Reporter"

export default class NullValidator extends Validator {

	constructor() {
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