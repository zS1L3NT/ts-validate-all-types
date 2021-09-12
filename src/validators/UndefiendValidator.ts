import Validator from "../classes/Validator"
import Reporter from "../classes/Reporter"

export default class UndefinedValidator extends Validator {

	public constructor() {
		super()

		this.schema = `undefined`
	}


	public validate(data: any, reporter: Reporter): boolean {
		if (data !== undefined) {
			return reporter.complain(
				`Expected (${reporter.getStack()}) to be of type \`undefined\``
			)
		}

		return true
	}

}