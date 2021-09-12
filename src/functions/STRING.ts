import StringValidator from "../validators/StringValidator"
import Validator from "../classes/Validator"

/**
 * Checks if next parameter is exactly the same as one of the passed patterns here
 * If no parameter passed, checks if next parameter is of type 'string'
 * @param patterns Strings
 */
export default function STRING(...patterns: string[]): Validator
/**
 * Checks if next parameter matches the passed RegExp here
 * @param patterns Pattern
 */
export default function STRING(patterns: RegExp): Validator
/**
 *
 * @param patterns Unaccepted types
 */
export default function STRING(...patterns: any[]): Validator {
	return new StringValidator(patterns)
}
