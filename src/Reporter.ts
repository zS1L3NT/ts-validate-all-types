export default class Reporter {
	private muted: boolean
	private stack: string[]
	public reports: string[]

	constructor(muted: boolean, stack: string[], reports: string[]) {
		this.muted = muted
		this.stack = stack
		this.reports = reports
	}

	public complain(message: string) {
		let report = ""
		for (let i = 0, il = this.stack.length; i < il; i++) {
			if (i === 0) report += `${this.stack[i]}`
			else report += ` > ${this.stack[i]}`
		}
		report += ": "

		if (!this.muted) this.reports.push(report + message)
	}

	public setStack(stack: string): Reporter {
		return new Reporter(this.muted, [...this.stack, stack], this.reports)
	}

	public getStack(): string {
		return this.stack[this.stack.length - 1]
	}

	public mute(): Reporter {
		this.muted = true
		return this
	}

	public unmute(): Reporter {
		this.muted = false
		return this
	}
}
