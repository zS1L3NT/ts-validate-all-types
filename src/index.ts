import Reporter from "./classes/Reporter"
import STRING from "./functions/STRING"
import NUMBER from "./functions/NUMBER"
import BOOLEAN from "./functions/BOOLEAN"
import LIST from "./functions/LIST"
import OBJECT from "./functions/OBJECT"
import NULL from "./functions/NULL"
import UNDEFINED from "./functions/UNDEFINED"
import OR from "./functions/OR"
import Validator from "./classes/Validator"

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
	pattern: Validator,
	name: string = "*"
): iValidationResult => {
	const reporter = new Reporter([name], [], false)
	const result = {
		success: pattern.validate(data, reporter),
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
	pattern: Validator
) => (req: any, res: any, next: Function) => {
	const data = req[item]
	const { success, errors } = validate(data, pattern, item)

	if (success) next()
	else res.status(400).send(errors)
}

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
	iValidationResult
}