import ObjectValidator from "../validators/ObjectValidator"
import Validator from "../classes/Validator"

/**
 * Checks if next parameter is exactly the same as one of the passed numbers here
 * If no parameter passed, checks if next parameter is of type 'number'
 * @param rule_object Rule
 */
export default <T extends { [property: string]: Validator }>(
	rule_object?: T
): ObjectValidator<T> => {
	return new ObjectValidator(rule_object)
}
