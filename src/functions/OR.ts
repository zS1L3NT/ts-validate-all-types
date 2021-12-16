import OrValidator from "../validators/OrValidator"
import Validator from "../classes/Validator"

/**
 * Checks if next parameter matches at least one of the rules here
 * @param rules List of rules to compare with
 */
export default <V extends Validator[]>(...rules: V): OrValidator<V> => {
	return new OrValidator(rules)
}
