import NumberValidator from "../validators/NumberValidator"
import Validator from "../classes/Validator"

/**
 * Checks if next parameter is exactly the same as one of the passed patterns here
 * If no parameter passed, checks if next parameter is of type 'number'
 * @param numbers Numbers
 */
export default function NUMBER(...numbers: number[]): Validator {
	return new NumberValidator(numbers)
}
