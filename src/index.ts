import BOOLEAN from "./functions/BOOLEAN"
import CLASS from "./functions/CLASS"
import LIST from "./functions/LIST"
import NULL from "./functions/NULL"
import NUMBER from "./functions/NUMBER"
import OBJECT from "./functions/OBJECT"
import OR from "./functions/OR"
import STRING from "./functions/STRING"
import UNDEFINED from "./functions/UNDEFINED"
import validate from "./functions/validate"
import withValidBody from "./functions/withValidBody"
import withValidQuery from "./functions/withValidQuery"

type iValidationError = {
	location: string
	message: string
	expected: string
	value: any
}

/**
 * Results on how the object rule matching went
 *
 * @param success Whether the data matched the rule defined
 * @param errors List of corrections in the data to make
 */
type iValidationResult<T> =
	| { success: true; errors: iValidationError[]; data: T }
	| { success: false; errors: iValidationError[]; data: undefined }

export {
	validate,
	withValidBody,
	withValidQuery,
	STRING,
	NUMBER,
	BOOLEAN,
	LIST,
	OBJECT,
	NULL,
	UNDEFINED,
	OR,
	CLASS,
	iValidationError,
	iValidationResult
}
