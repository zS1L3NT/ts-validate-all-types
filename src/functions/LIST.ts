import ListValidator from "../validators/ListValidator"
import Validator from "../classes/Validator"

/**
 * Checks if next parameter is exactly the same as one of the passed patterns here
 * If no parameter passed, checks if next parameter is of type 'list'
 * @param patterns Patterns
 */
export default function LIST(...patterns: Validator[]): ListValidator {
	return new ListValidator(patterns)
}