import { ITpattern } from "."
import Reporter from "./Reporter"

/**
 * & Type for NOT operation
 */
export type ITnot = (item: any) => (reporter: Reporter) => boolean
/**
 * Checks if next parameter does not match the pattern here
 * @param patterns Pattern to compare with
 */
export default function Tnot(pattern: ITpattern): ITnot {
	return item => reporter => {
		const type_ = pattern(item)(reporter.mute())
		reporter.unmute()
		if (type_) {
			reporter.complain(`Expected (${reporter.getStack()}) to not match the given pattern`)
		}
		return !type_
	}
}
