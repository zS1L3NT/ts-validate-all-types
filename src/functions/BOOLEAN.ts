import BooleanValidator from "../validators/BooleanValidator"
import Validator from "../classes/Validator"

/**
 * Checks if next parameter is exactly the same as the boolean passed here
 * If no parameter passed, checks if next parameter is of type 'boolean'
 */
export default function BOOLEAN(boolean?: boolean): Validator {
	return new BooleanValidator(boolean)
}
