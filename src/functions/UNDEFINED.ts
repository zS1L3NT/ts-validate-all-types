import UndefinedValidator from "../validators/UndefinedValidator"

/**
 * Checks if next parameter is of type 'undefined'
 */
export default <T extends undefined>(): UndefinedValidator<T> => {
	return new UndefinedValidator()
}
