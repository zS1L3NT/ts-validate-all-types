import { iValidationResult } from ".."

export default class Reporter {
	private readonly stack: string[]
	public reports: string[]
	private readonly silent: boolean

	public constructor(stack: string[], reports: string[], silent: boolean) {
		this.stack = stack
		this.reports = reports
		this.silent = silent
	}

	public throw(message: string) {
		let report = ""
		for (let i = 0, il = this.stack.length; i < il; i++) {
			if (i === 0) report += `${this.stack[i]}`
			else report += ` > ${this.stack[i]}`
		}
		report += ": " + message

		throw new Error(report)
	}

	public complain<T>(message: string): iValidationResult<T> {
		if (this.silent) return { success: false, errors: [], data: undefined }
		let report = ""
		for (let i = 0, il = this.stack.length; i < il; i++) {
			if (i === 0) report += `${this.stack[i]}`
			else report += ` > ${this.stack[i]}`
		}
		report += ": " + message

		this.reports.push(report)
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
