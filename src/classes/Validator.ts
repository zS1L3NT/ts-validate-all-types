import Locator from "./Locator"
import { iValidationResult } from ".."
import { js as beautify } from "js-beautify"

export default abstract class Validator<T> {
	public static readonly WRONG_TYPE = `Value is not of the correct type`
	public static readonly WRONG_VALUE = `Value is not allowed`
	public schema = ""

	public abstract validate(data: any, locator: Locator): iValidationResult<T>

	/**
	 * A rough gauge of what the schema looks like
	 * Formatting is similar to that of a TypeScript interface
	 *
	 * @return string String of the formatted schema
	 */
	public formatSchema(): string {
		return beautify(this.schema, { indent_size: 4 })
	}

	protected success(data: T): iValidationResult<T> {
		return {
			success: true,
			errors: [],
			data: data as T
		}
	}

	protected failure(
		locator: Locator,
		message: string,
		validator: Validator<any>,
		data: any
	): iValidationResult<T> {
		return {
			success: false,
			errors: [
				{
					location: locator.getLocation(),
					message,
					expected: validator.formatSchema(),
					value: data
				}
			],
			data: undefined
		}
	}

	protected throw(locator: Locator, message: string) {
		throw new Error(locator.getLocation() + ": " + message)
	}
}
