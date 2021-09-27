import Validator from "../classes/Validator"
import NullValidator from "../validators/NullValidator"

/**
 * Checks if next parameter is of type 'null'
 * Method name is in capitals because null is a keyword
 */
export default function NULL(): Validator {
	return new NullValidator()
}
