import Locator from "../classes/Locator"
import Validator from "../classes/Validator"
import { iValidationResult } from ".."

/**
 * Function to check the type of an expression
 * @param data The object we are checking
 * @param rule A specific rule to compare the object to (more about this later)
 * @param name The name of the root object when logs display errors. Defaults to `*` as root
 *
 * @return object The result of whether the object matched the rule
 */
export default <T>(
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
