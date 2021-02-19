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
 * @return [1]: Boolean of whether the object matches the Pattern
 * @return [2]: Error messages if any 
 */
export default (obj: any, pattern: ITpattern): [boolean, string[]] => {
	const reporter = new Reporter(false, ["*"], [])
	return [pattern(obj)(reporter), reporter.reports]
}

/**
 * & Type for a pattern
 */
type ITpattern = ITstring | ITnumber | ITboolean | ITlist | ITobject | ITundefined | ITnull

export { Tstring, Tnumber, Tboolean, Tlist, Tobject, Tnull, Tundefined, ITpattern }