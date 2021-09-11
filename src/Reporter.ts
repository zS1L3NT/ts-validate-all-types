export default class Reporter {
	private readonly stack: string[]
	public reports: string[]

	public constructor(stack: string[], reports: string[]) {
		this.stack = stack
		this.reports = reports
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

	public complain(message: string, silent: boolean): false {
		if (silent) return false
		let report = ""
		for (let i = 0, il = this.stack.length; i < il; i++) {
			if (i === 0) report += `${this.stack[i]}`
			else report += ` > ${this.stack[i]}`
		}
		report += ": " + message

		this.reports.push(report)
		return false
	}

	public setStack(stack: string): Reporter {
		return new Reporter([...this.stack, stack], this.reports)
	}

	public getStack(): string {
		return this.stack[this.stack.length - 1]
	}
}
