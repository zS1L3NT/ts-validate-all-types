import ListValidator from "../validators/ListValidator"
import Validator from "../classes/Validator"

/**
 * Checks if next parameter is exactly the same as one of the passed rules here
 * If no parameter passed, checks if next parameter is of type 'list'
 * @param rules Rules
 */
export default <T extends Validator[]>(...rules: T): ListValidator<T> => {
	return new ListValidator(rules)
}
