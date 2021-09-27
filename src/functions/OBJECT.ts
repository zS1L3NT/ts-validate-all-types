import Validator from "../classes/Validator"
import ObjectValidator from "../validators/ObjectValidator"

/**
 * Checks if next parameter is exactly the same as one of the passed numbers here
 * If no parameter passed, checks if next parameter is of type 'number'
 * @param rule_object Rule
 */
export default function OBJECT(rule_object?: { [property: string]: Validator }): Validator {
	return new ObjectValidator(rule_object)
}