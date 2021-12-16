import BooleanValidator from "../validators/BooleanValidator"

/**
 * Checks if next parameter is exactly the same as the boolean passed here
 * If no parameter passed, checks if next parameter is of type 'boolean'
 */
export default function BOOLEAN(boolean?: boolean): BooleanValidator {
	return new BooleanValidator(boolean)
}
