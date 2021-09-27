import Validator from "../classes/Validator"
import UndefinedValidator from "../validators/UndefinedValidator"

/**
 * Checks if next parameter is of type 'undefined'
 */
export default function UNDEFINED(): Validator {
	return new UndefinedValidator()
}
