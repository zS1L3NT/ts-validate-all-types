import Locator from "./Locator"
import { iValidationResult } from ".."

export default abstract class Validator<T> {
	public static readonly WRONG_TYPE = `Value is not of the correct type`
	public static readonly WRONG_VALUE = `Value is not allowed`
	public schema = ""

	public abstract validate(data: any, locator: Locator): iValidationResult<T>

	/**
	 * Schema of the validator as a JSON object
	 *
	 * @returns JSON Schema of the object
	 */
	public getSchema(): any {
		return JSON.parse(this.schema)
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
					expected: validator.getSchema(),
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
