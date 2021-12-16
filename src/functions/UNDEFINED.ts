import UndefinedValidator from "../validators/UndefinedValidator"

/**
 * Checks if next parameter is of type 'undefined'
 */
export default (): UndefinedValidator => {
	return new UndefinedValidator()
}
