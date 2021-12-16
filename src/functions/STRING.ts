import StringValidator from "../validators/StringValidator"

/**
 * Checks if next parameter is exactly the same as one of the passed rules here
 * If no parameter passed, checks if next parameter is of type 'string'
 * @param rules Strings
 */
export default function STRING(...rules: string[]): StringValidator
/**
 * Checks if next parameter matches the passed RegExp here
 * @param rules Rule
 */
export default function STRING(rules: RegExp): StringValidator
/**
 *
 * @param rules Unaccepted types
 */
export default function STRING(...rules: any[]): StringValidator {
	return new StringValidator(rules)
}
