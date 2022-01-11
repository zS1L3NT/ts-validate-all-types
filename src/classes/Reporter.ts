import Validator from "./Validator"
import { iValidationError, iValidationResult } from ".."

export default class Reporter {
	private readonly stack: string[]
	public reports: iValidationError[]
	private readonly silent: boolean

	public constructor(
		stack: string[],
		reports: iValidationError[],
		silent: boolean
	) {
		this.stack = stack
		this.reports = reports
		this.silent = silent
	}

	public throw(message: string) {
		throw new Error(this.stack.join(" > ") + ": " + message)
	}

	public complain<T>(
		message: string,
		validator: Validator<any>,
		value: any
	): iValidationResult<T> {
		if (this.silent) return { success: false, errors: [], data: undefined }

		this.reports.push({
			location: this.stack.join(" > "),
			message,
			expected: validator.formatSchema(),
			value
		})

		return { success: false, errors: this.reports, data: undefined }
	}

	public silence() {
		return new Reporter(this.stack, this.reports, true)
	}

	public setStack(stack: string): Reporter {
		return new Reporter([...this.stack, stack], this.reports, this.silent)
	}

	public getStack(): string {
		return this.stack[this.stack.length - 1]
	}
}
