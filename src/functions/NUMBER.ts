import NumberValidator from "../validators/NumberValidator"

/**
 * Checks if next parameter is exactly the same as one of the passed rules here
 * If no parameter passed, checks if next parameter is of type 'number'
 * @param numbers Numbers
 */
export default <T extends number>(...numbers: T[]): NumberValidator<T> => {
	return new NumberValidator(numbers)
}
