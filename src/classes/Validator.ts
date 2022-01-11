import Reporter from "./Reporter"
import { iValidationResult } from ".."

const beautify = require("js-beautify").js

export default abstract class Validator<T> {
	public static WRONG_TYPE = `Value is not of the correct type`
	public static WRONG_VALUE = `Value is not allowed`
	public schema = ""

	public abstract validate(
		data: any,
		reporter: Reporter
	): iValidationResult<T>

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
}
