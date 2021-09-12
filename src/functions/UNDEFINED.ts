import UndefinedValidator from "../validators/UndefiendValidator"
import Validator from "../classes/Validator"

/**
 * Checks if next parameter is of type 'undefined'
 */
export default function UNDEFINED(): Validator {
	return new UndefinedValidator()
}
