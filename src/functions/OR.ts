import OrValidator from "../validators/OrValidator"
import Validator from "../classes/Validator"

/**
 * Checks if next parameter matches at least one of the rules here
 * @param rules List of rules to compare with
 */
export default <T extends Validator[]>(...rules: T): OrValidator<T> => {
	return new OrValidator(rules)
}
