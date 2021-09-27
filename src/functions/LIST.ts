import Validator from "../classes/Validator"
import ListValidator from "../validators/ListValidator"

/**
 * Checks if next parameter is exactly the same as one of the passed rules here
 * If no parameter passed, checks if next parameter is of type 'list'
 * @param rules Rules
 */
export default function LIST(...rules: Validator[]): ListValidator {
	return new ListValidator(rules)
}