import UndefinedValidator from "../validators/UndefinedValidator"

/**
 * Checks if next parameter is of type 'undefined'
 */
export default function UNDEFINED(): UndefinedValidator {
	return new UndefinedValidator()
}
