import Reporter from "../classes/Reporter"
import Validator from "../classes/Validator"

export default class UndefinedValidator extends Validator {

	public constructor() {
		super()

		this.schema = `undefined`
	}

	public validate(data: any, reporter: Reporter): boolean {
		if (data !== undefined) {
			return reporter.complain(
				this.replaceText(Validator.not_value, {
					type: `undefined`
				})
			)
		}

		return true
	}

}