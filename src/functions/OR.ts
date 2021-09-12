import Validator from "../classes/Validator"
import OrValidator from "../validators/OrValidator"

/**
 * Checks if next parameter matches at least one of the patterns here
 * @param patterns List of patterns to compare with
 */
export default function OR(...patterns: Validator[]): Validator {
    return new OrValidator(patterns)
}
