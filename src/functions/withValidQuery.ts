import Validator from "../classes/Validator"
import { validate } from ".."

/**
 * Use this function to verify the types for an api's request's query string
 * This way, you can catch errors before they affect your express callback
 *
 * @param rule Rule to compare the object with
 */
export default <T>(validator: Validator<T>) =>
	<Request extends { query: any }, Response>(
		handler: (
			req: Omit<Request, "query"> & { query: T },
			res: Response
		) => void
	) =>
	(req: Request, res: any) => {
		const { success, errors, data } = validate(req.query, validator)

		if (success) {
			req.query = data!
			handler(req, res)
		} else {
			res.status(400).send({ errors })
		}
	}
