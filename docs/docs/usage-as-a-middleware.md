# Usage as a Middleware

You can use validate-any with Express/NextJS as a middleware.<br />
This way, you can verify types of the requests before invalid types ruin your server.<br />

## How invalid requests are handled

If a request with an invalid schema is detected, the response code will be 400 and the returned data will look like this:

```json
{
	"errors": [
		{
			"location": "* > property",
			"message": "Object requires this property but is missing",
			"expected": {
				"$type": "string"
			}
		},
		{
			"location": "* > prop",
			"message": "Object has unknown property which is defined",
			"expected": {
				"$type": "undefined"
			},
			"value": "value"
		}
	]
}
```

## `withValidBody` function

The `withValidBody()` function is used to validate the data in the request body.

### Examples

```ts
import { OBJECT, STRING, withValidBody } from "validate-any"

// Express
app.post(
	"/body",
	withValidBody(OBJECT({ usnm: STRING(), pswd: STRING() }))((req, res) => {
		const { usnm, pswd } = req.body
		console.log(`Username: ${usnm}`, `Password: ${pswd}`)
		res.end()
	})
)

// NextJS
export default withValidBody(OBJECT({ usnm: STRING(), pswd: STRING() }))(
	(req, res) => {
		const { usnm, pswd } = req.body
		console.log(`Username: ${usnm}`, `Password: ${pswd}`)
		res.end()
	}
)
```

## `withValidQuery` function

The `withValidQuery()` function is used to validate the data in the request query.<br />
However since request queries are always of type `Record<string, string>`,
this function is mainly used to check if a property name exists in the request query,
rather than to check the type of the data in the request query.

### Examples

```ts
import { OBJECT, STRING, withValidQuery } from "validate-any"

// Express
app.get(
	"/search",
	withValidQuery(OBJECT({ query: STRING() }))((req, res) => {
		const { query } = req.query
		console.log(`Query: ${query}`)
		res.end()
	})
)

// NextJS
export default withValidQuery(OBJECT({ query: STRING() }))((req, res) => {
	const { query } = req.query
	console.log(`Query: ${query}`)
	res.end()
})
```
