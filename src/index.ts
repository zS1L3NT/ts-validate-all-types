import Reporter from "./Reporter"
import Tstring, { ITstring } from "./Tstring"
import Tnumber, { ITnumber } from "./Tnumber"
import Tboolean, { ITboolean } from "./Tboolean"
import Tlist, { ITlist } from "./Tlist"
import Tobject, { ITobject } from "./Tobject"
import Tnull, { ITnull } from "./Tnull"
import Tundefined, { ITundefined } from "./Tundefined"

/**
 * Function to check the type of an expression
 * @param obj Object to check the type of
 * @param pattern Pattern to compare with the object
 * @param name OPTIONAL name for the root of the Object for the logs
 * @return [1]: Boolean of whether the object matches the Pattern
 * @return [2]: Error messages if any
 */
const Check = (obj: any, pattern: ITpattern, name?: string): [boolean, string[]] => {
	const reporter = new Reporter(false, [name || "*"], [])
	return [pattern(obj)(reporter), reporter.reports]
}

const ValidateRequest = (item: "body" | "params", pattern: ITpattern) => (
	req: any,
	res: any,
	next: Function
) => {
	const obj = req[item]
	const [success, errors] = Check(obj, pattern, item)
	if (success) next()
	else res.status(400).send(errors)
}

/**
 * & Type for a pattern
 */
type ITpattern =
	| ITstring
	| ITnumber
	| ITboolean
	| ITlist
	| ITobject
	| ITundefined
	| ITnull

export {
	ValidateRequest,
	Tstring,
	Tnumber,
	Tboolean,
	Tlist,
	Tobject,
	Tnull,
	Tundefined,
	ITpattern
}
export default Check
