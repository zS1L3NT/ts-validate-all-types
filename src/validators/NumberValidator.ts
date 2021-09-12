import Validator from "../classes/Validator"
import Reporter from "../classes/Reporter"

export default class NumberValidator extends Validator {
	public static not_among_numbers = `Expected value to be one of the numbers: %numbers%`
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
				this.replaceText(Validator.not_type, {
					type: `number`
				})
			)
		}

		if (this.numbers.length > 0) {
			if (!this.numbers.includes(data)) {
				return reporter.complain(
					this.replaceText(NumberValidator.not_among_numbers, {
						numbers: this.numbers
					})
				)
			}
		}

		return true
	}

}