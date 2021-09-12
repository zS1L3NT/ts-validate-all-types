import Validator from "../classes/Validator"
import Reporter from "../classes/Reporter"

export default class BooleanValidator extends Validator {
	private readonly boolean?: boolean

	public constructor(boolean?: boolean) {
		super()

		this.boolean = boolean
		if (boolean !== undefined) {
			this.schema = `${boolean}`
		} else {
			this.schema = `boolean`
		}
	}

	public validate(data: any, reporter: Reporter): boolean {
		if (typeof data !== "boolean") {
			return reporter.complain(
				`Expected (${reporter.getStack()}) to be of type \`boolean\``
			)
		}

		if (this.boolean !== undefined && data !== this.boolean) {
			return reporter.complain(
				`Expected (${reporter.getStack()}) to be \`${this.boolean}\``
			)
		}

		return true
	}

}