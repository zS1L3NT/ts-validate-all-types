import Validator from "../classes/Validator"
import Reporter from "../classes/Reporter"

export default class NumberValidator extends Validator {
	private readonly numbers: number[]

	public constructor(numbers: number[]) {
		super()

		this.numbers = numbers
		if (numbers.length === 0) {
			this.schema = `number`
		} else {
			this.schema = numbers.join(" | ")
		}
	}


	public validate(data: any, reporter: Reporter): boolean {
		if (typeof data !== "number") {
			return reporter.complain(
				`Expected (${reporter.getStack()}) to be of type \`number\``
			)
		}

		if (this.numbers.length > 0) {
			if (!this.numbers.includes(data)) {
				return reporter.complain(
					`Expected (${reporter.getStack()}) to be in (${JSON.stringify(
						this.numbers
					)})`
				)
			}
		}

		return true
	}

}