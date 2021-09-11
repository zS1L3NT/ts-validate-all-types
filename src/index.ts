import Reporter from "./Reporter"
import STRING from "./validators/STRING"
import NUMBER from "./validators/NUMBER"
import BOOLEAN from "./validators/BOOLEAN"
import LIST from "./validators/LIST"
import OBJECT from "./validators/OBJECT"
import NULL from "./validators/NULL"
import UNDEFINED from "./validators/UNDEFINED"
import OR from "./validators/OR"
import AND from "./validators/AND"
import NOT from "./validators/NOT"

/**
 * Results on how the object pattern matching went
 *
 * @param success Whether the data matched the pattern defined
 * @param errors List of corrections in the data to make
 */
interface iValidationResult {
	success: boolean
	errors: string[]
}

/**
 * Function to check the type of an expression
 * @param data The object we are checking
 * @param pattern A specific pattern to compare the object to (more about this later)
 * @param name The name of the root object when logs display errors. Defaults to `*` as root
 *
 * @return object The result of whether the object matched the pattern
 */
const validate = (
	data: any,
	pattern: iPattern,
	name: string = "*"
): iValidationResult => {
	const reporter = new Reporter([name], [])
	const result = {
		success: pattern(data)(reporter, false),
		errors: reporter.reports
	}

	if (result.success === result.errors.length > 0) {
		console.warn("Error with typechecking. Create an issue on https://github.com/zS1L3NT/ts-validate-all-types with the PATTERN AND the data below", {
			data,
			errors: result.errors
		})
	}

	return result
}

/**
 * Use this function to verify the types for an express request.
 * This way, you can catch errors before they affect your express callback
 *
 * @param item Can either verify the `req.body` or `req.params` object
 * @param pattern Pattern to compare the object with
 */
const validate_express = (
	item: "body" | "params",
	pattern: iPattern
) => (req: any, res: any, next: Function) => {
	const data = req[item]
	const { success, errors } = validate(data, pattern, item)

	if (success) next()
	else res.status(400).send(errors)
}

/**
 * & Type for a pattern
 */
type iPattern = (data: any) => (reporter: Reporter, silent: boolean) => boolean

export {
	validate,
	validate_express,
	STRING,
	NUMBER,
	BOOLEAN,
	LIST,
	OBJECT,
	NULL,
	UNDEFINED,
	OR,
	AND,
	NOT,
	iPattern,
	iValidationResult
}