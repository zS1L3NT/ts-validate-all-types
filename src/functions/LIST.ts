import ListValidator from "../validators/ListValidator"
import Validator from "../classes/Validator"

/**
 * Checks if next parameter is exactly the same as one of the passed rules here
 * If no parameter passed, checks if next parameter is of type 'list'
 * @param rules Rules
 */
export default <V extends Validator[]>(...rules: V): ListValidator<V> => {
	return new ListValidator(rules)
}
