import BOOLEAN from "./functions/BOOLEAN"
import LIST from "./functions/LIST"
import NULL from "./functions/NULL"
import NUMBER from "./functions/NUMBER"
import NumberValidator from "./validators/NumberValidator"
import OBJECT from "./functions/OBJECT"
import ObjectValidator from "./validators/ObjectValidator"
import OR from "./functions/OR"
import OrValidator from "./validators/OrValidator"
import Reporter from "./classes/Reporter"
import STRING from "./functions/STRING"
import StringValidator from "./validators/StringValidator"
import UNDEFINED from "./functions/UNDEFINED"
import Validator from "./classes/Validator"

/**
 * Results on how the object rule matching went
 *
 * @param success Whether the data matched the rule defined
 * @param errors List of corrections in the data to make
 */
type iValidationResult =
	| { success: true; errors: [] }
	| { success: false; errors: string[] }

/**
 * Function to check the type of an expression
 * @param data The object we are checking
 * @param rule A specific rule to compare the object to (more about this later)
 * @param name The name of the root object when logs display errors. Defaults to `*` as root
 *
 * @return object The result of whether the object matched the rule
 */
const validate = <T extends Validator>(
	data: any,
	rule: T,
	name: string = "*"
): iValidationResult => {
	const reporter = new Reporter([name], [], false)
	const success = rule.validate(data, reporter)

	if (success === reporter.reports.length > 0) {
		console.warn(
			"Error with typechecking. Create an issue on https://github.com/zS1L3NT/ts-npm-validate-any with the PATTERN AND the data below",
			{
				data,
				errors: reporter.reports
			}
		)
	}

	if (success) {
		return {
			success,
			errors: []
		}
	} else {
		return {
			success,
			errors: reporter.reports
		}
	}
}

/**
 * Use this function to verify the types for an express request's body
 * This way, you can catch errors before they affect your express callback
 *
 * @param rule Rule to compare the object with
 */
const validate_express =
	(rule: Validator) => (req: any, res: any, next: Function) => {
		const { success, errors } = validate(req.body, rule, "body")

		if (success) next()
		else res.status(400).send(errors)
	}

/**
 * Interface holding input type of `setup_validate_messages()`
 *
 * @param not_type Replaces `%type%` with the expected type
 * @param not_value Replaces `%value%` with the expected value
 * @param not_regex_match Replaces `%regex%` with the allowed regex
 * @param not_among_strings Replaces `%strings%` with the allowed strings
 * @param not_among_numbers Replaces `%numbers%` with the allowed numbers
 * @param not_among_rules Replaces `%rules%` with the allowed rules
 * @param missing_property Replaces `%property%` with the missing property
 * @param unknown_property Replaces `%property%` with the unknown property
 */
interface iSetupValidateMessages {
	not_type?: string
	not_value?: string
	not_regex_match?: string
	not_among_strings?: string
	not_among_numbers?: string
	not_among_rules?: string
	missing_property?: string
	unknown_property?: string
}

/**
 * Setup your own custom validation error messages. Each property in the object
 * defines the string returned when a rule is not matched. Each of these strings
 * can contain dynamic values like `%property%` or `%type%` that will be replaced
 * when a rule matching fails.
 *
 * All possible dynamic values are documented in the package's README.md file
 * and in the Typescript interface `iSetupValidateMessages`
 *
 * @see iSetupValidateMessages
 * @see https://www.github.com/zS1L3NT/ts-npm-validate-any
 * @example
 * setup_validate_messages({
 *     not_type: `Bad type, expected %type%`
 * })
 * console.log(validate("string", NUMBER()))
 * // {
 * //     success: false,
 * //     errors: [ '*: Bad type, expected number' ]
 * // }
 */
const setup_validate_messages = ({
	not_type,
	not_value,
	not_regex_match,
	not_among_strings,
	not_among_numbers,
	not_among_rules,
	missing_property,
	unknown_property
}: iSetupValidateMessages) => {
	if (not_type) Validator.not_type = not_type
	if (not_value) Validator.not_value = not_value
	if (not_regex_match) StringValidator.not_regex_match = not_regex_match
	if (not_among_strings) StringValidator.not_among_strings = not_among_strings
	if (not_among_numbers) NumberValidator.not_among_numbers = not_among_numbers
	if (not_among_rules) OrValidator.not_among_rules = not_among_rules
	if (missing_property) ObjectValidator.missing_property = missing_property
	if (unknown_property) ObjectValidator.unknown_property = unknown_property
}

export {
	validate,
	validate_express,
	setup_validate_messages,
	STRING,
	NUMBER,
	BOOLEAN,
	LIST,
	OBJECT,
	NULL,
	UNDEFINED,
	OR,
	iValidationResult
}
