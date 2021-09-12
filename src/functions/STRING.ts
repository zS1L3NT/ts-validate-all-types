import StringValidator from "../validators/StringValidator"
import Validator from "../classes/Validator"

/**
 * Checks if next parameter is exactly the same as one of the passed rules here
 * If no parameter passed, checks if next parameter is of type 'string'
 * @param rules Strings
 */
export default function STRING(...rules: string[]): Validator
/**
 * Checks if next parameter matches the passed RegExp here
 * @param rules Rule
 */
export default function STRING(rules: RegExp): Validator
/**
 *
 * @param rules Unaccepted types
 */
export default function STRING(...rules: any[]): Validator {
	return new StringValidator(rules)
}
