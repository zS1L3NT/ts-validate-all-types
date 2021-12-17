import OrValidator from "../validators/OrValidator"
import Validator from "../classes/Validator"

/**
 * Checks if next parameter matches at least one of the rules here
 * @param rules List of rules to compare with
 */
export default <T extends Validator<any>[]>(
	...rules: T
): OrValidator<T[number] extends Validator<infer U> ? U : never> => {
	return new OrValidator(rules)
}
