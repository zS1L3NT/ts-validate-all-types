import BOOLEAN from "./functions/BOOLEAN"
import LIST from "./functions/LIST"
import Locator from "./classes/Locator"
import NULL from "./functions/NULL"
import NUMBER from "./functions/NUMBER"
import OBJECT from "./functions/OBJECT"
import OR from "./functions/OR"
import STRING from "./functions/STRING"
import UNDEFINED from "./functions/UNDEFINED"
import Validator from "./classes/Validator"

type iValidationError = {
	location: string
	message: string
	expected: string
	value: any
}

/**
 * Results on how the object rule matching went
 *
 * @param success Whether the data matched the rule defined
 * @param errors List of corrections in the data to make
 */
type iValidationResult<T> =
	| { success: true; errors: iValidationError[]; data: T }
	| { success: false; errors: iValidationError[]; data: undefined }

/**
 * Function to check the type of an expression
 * @param data The object we are checking
 * @param rule A specific rule to compare the object to (more about this later)
 * @param name The name of the root object when logs display errors. Defaults to `*` as root
 *
 * @return object The result of whether the object matched the rule
 */
const validate = <T>(
	data: any,
	rule: Validator<T>,
	name: string = "*"
): iValidationResult<T> => {
	const locator = new Locator([name])
	const result = rule.validate(data, locator)

	if (result.success === result.errors.length > 0) {
		console.warn(
			"Error with typechecking. Create an issue on https://github.com/zS1L3NT/ts-npm-validate-any with the PATTERN AND the data below",
			result.errors
		)
	}

	return result
}

/**
 * Use this function to verify the types for an api's request's body
 * This way, you can catch errors before they affect your express callback
 *
 * @param rule Rule to compare the object with
 */
const withValidBody =
	<T, Request extends { body: any }>(
		validator: Validator<T>,
		handler: (req: Omit<Request, "body"> & { body: T }, res: any) => void
	) =>
	(req: Request, res: any) => {
		const { success, errors, data } = validate(req.body, validator)

		if (success) {
			req.body = data!
			handler(req, res)
		} else {
			res.status(400).send({ errors })
		}
	}

export {
	validate,
	withValidBody,
	STRING,
	NUMBER,
	BOOLEAN,
	LIST,
	OBJECT,
	NULL,
	UNDEFINED,
	OR,
	iValidationError,
	iValidationResult
}
