import Validator from "../classes/Validator"
import { validate } from ".."

/**
 * Use this function to verify the types for an api's request's body
 * This way, you can catch errors before they affect your express callback
 *
 * @param rule Rule to compare the object with
 */
export default <T, Request extends { body: any }>(
		validator: Validator<T>,
		handler: (req: Omit<Request, "body"> & { body: T }, res: any) => void
	) =>
	(req: Request, res: any) => {
		const { success, errors, data } = validate(req.body, validator)

		if (success) {
			req.body = data!
			handler(req, res)
		} else {
			res.status(400).send({ errors })
		}
	}
