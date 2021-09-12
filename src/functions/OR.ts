import Validator from "../classes/Validator"
import OrValidator from "../validators/OrValidator"

/**
 * Checks if next parameter matches at least one of the rules here
 * @param rules List of rules to compare with
 */
export default function OR(...rules: Validator[]): Validator {
	return new OrValidator(rules)
}
