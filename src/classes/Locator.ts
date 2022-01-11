export default class Locator {
	private readonly stack: string[]

	public constructor(stack: string[]) {
		this.stack = stack
	}

	public traverse(location: string): Locator {
		return new Locator([...this.stack, location])
	}

	public getLocation(): string {
		return this.stack.join(" > ")
	}
}
