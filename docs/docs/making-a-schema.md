# Making a Schema

## `STRING` function

The `STRING()` function is used to validate that data is of type `string`<br />
`STRING()` changes it's behaviour according to the parameters passed to it.

::: tip Parameters

| Type          | Description                                                          |
| ------------- | -------------------------------------------------------------------- |
| `(empty)`     | Checks if the input is a string                                      |
| `RegExp`      | Checks if the input is a string and matches the RegExp               |
| `...string[]` | Checks if the input is a string and matches any of the given strings |

:::

::: details TypeScript Source Code

```ts
/* STRING.ts */

export default function STRING<T extends string>(...rules: T[]): /* ... */
export default function STRING<T extends RegExp>(rules: T): /* ... */
```

:::

```ts
import { validate, STRING } from "validate-any"

console.log(validate("string", STRING()))
// > { success: true, errors: [], data: "string" }
// This returned true because "string" is a string

console.log(validate(0, STRING()))
// > {
// >      success: false,
// >      errors: [ { message: 'Value is not of the correct type', ... } ],
// >      data: undefined
// > }
// This returned false because 0 is not a string

console.log(validate("string", STRING(/^string$/)))
// > { success: true, errors: [], data: "string" }
// This returned true because "string" matches the RegExp /^string$/

console.log(validate("string", STRING(/^something-else$/)))
// > {
// >      success: false,
// >      errors: [ { message: 'Value does not match the defined RegExp pattern', ... } ],
// >      data: undefined
// > }
// This returned false because "string" didn't match the RegExp /^something-else$/

console.log(validate("string", STRING("does", "the", "string", "match", "?")))
// > { success: true, errors: [], data: "string" }
// This returned true because "string" was passed into STRING() as a parameter

console.log(validate("string", STRING("doesn't", "match"), "my-string"))
// > {
// >      success: false,
// >      errors: [ {
// >          message: `Value doesn't match anything in the defined set of strings`,
// >          location: `my-string`,
// >          ...
// >      } ],
// >      data: undefined
// > }
// This returns false because "string" wasn't passed into STRING() as a parameter
// Also notice that the location was "my-string" since we passed "my-string"
//     as the name of the data in the third parameter of the validate() function
```

## `NUMBER` function

The `NUMBER()` function is used to validate that data is of type `number`<br />
`NUMBER()` works the same was as `STRING()` except allows a different set of parameters:

::: tip Parameters

| Type          | Description                                                          |
| ------------- | -------------------------------------------------------------------- |
| `(empty)`     | Checks if the input is a number                                      |
| `...number[]` | Checks if the input is a number and matches any of the given numbers |

:::

::: details TypeScript Source Code

```ts
/* NUMBER.ts */

export default <T extends number>(...numbers: T[]): /* ... */
```

:::

```ts
import { validate, NUMBER } from "validate-any"

console.log(validate(3, NUMBER()))
// > { success: true, errors: [], data: 3 }

console.log(validate("string", NUMBER()))
// > {
// >      success: false,
// >      errors: [ { message: 'Value is not of the correct type', ... } ],
// >      data: undefined
// > }

console.log(validate(3, NUMBER(1, 2, 3, 4, 5)))
// > { success: true, errors: [], data: 3 }

console.log(validate(3, NUMBER(6, 7, 8, 9, 10)))
// > {
// >      success: false,
// >      errors: [ {
// >          message: 'Value doesn't match anything in the defined set of numbers',
// >          ...
// >      } ],
// >      data: undefined
// > }
```

## `BOOLEAN` function

The `BOOLEAN()` function is used to validate that data is of type `boolean`<br />
`BOOLEAN()` allows comparison of booleans only

::: tip Parameters

| Type      | Description                                                    |
| --------- | -------------------------------------------------------------- |
| `(empty)` | Checks if the input is a boolean                               |
| `boolean` | Checks if the input is a boolean and if the booleans are equal |

:::

::: details TypeScript Source Code

```ts
/* BOOLEAN.ts */

export default <T extends boolean>(boolean?: T): /* ... */
```

:::

```ts
import { validate, BOOLEAN } from "validate-any"

console.log(validate(true, BOOLEAN()))
// > { success: true, errors: [], data: true }

console.log(validate("string", BOOLEAN()))
// > {
// >      success: false,
// >      errors: [ { message: 'Value is not of the correct type', ... } ],
// >      data: undefined
// > }

console.log(validate(true, BOOLEAN(true)))
// > { success: true, errors: [], data: true }

console.log(validate(false, BOOLEAN(true)))
// > {
// >      success: false,
// >      errors: [ { message: 'Value is not allowed', ... } ],
// >      data: undefined
// > }
```

## `NULL` function

The `NULL()` function is used to validate that data is exactly `null`<br />
`NULL()` doesn't allow variations of the parameters

::: tip Parameters

| Type      | Description                   |
| --------- | ----------------------------- |
| `(empty)` | Checks if the input is a null |

:::

::: details TypeScript Source Code

```ts
/* NULL.ts */

export default <T extends null>(): /* ... */
```

:::

```ts
import { validate, NULL } from "validate-any"

console.log(validate(null, NULL()))
// > { success: true, errors: [], data: null }

console.log(validate(undefined, NULL()))
// > {
// >      success: false,
// >      errors: [ { message: 'Value is not allowed', ... } ],
// >      data: undefined
// > }
```

## `UNDEFINED` function

The `UNDEFINED()` function is used to validate that data is exactly `undefined`<br />
Just like `NULL()`, `UNDEFINED()` doesn't allow variations of the parameters

::: tip Parameters

| Type      | Description                        |
| --------- | ---------------------------------- |
| `(empty)` | Checks if the input is a undefined |

:::

::: details TypeScript Source Code

```ts
/* UNDEFINED.ts */

export default <T extends undefined>(): /* ... */
```

:::

```ts
import { validate, UNDEFINED } from "validate-any"

console.log(validate(undefined, UNDEFINED()))
// > { success: true, errors: [], data: undefined }

console.log(validate(null, UNDEFINED()))
// > {
// >      success: false,
// >      errors: [ { message: 'Value is not allowed', ... } ],
// >      data: undefined
// > }
```

## `LIST` function

The `LIST()` function is used to validate that data is an array<br />
`LIST()` changes it's behaviour according to the parameters passed to it.

::: tip Parameters

| Type             | Description                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| `(empty)`        | Checks if the input is a list                                                                          |
| `...Validator[]` | Checks if the input is a list and checks if all items in the list match at least 1 of the Rules stated |

:::

::: details TypeScript Source Code

```ts
/* LIST.ts */

export default <T extends Validator<any>[]>(...rules: T): /* ... */
```

:::

```ts
import { validate, LIST, STRING, NUMBER } from "validate-any"

console.log(validate([1, 2, 3, 4, 5], LIST()))
// > { success: true, errors: [], data: [ 1, 2, 3, 4, 5 ] }

console.log(validate({ property: "value" }, LIST()))
// > {
// >      success: false,
// >      errors: [ { message: 'Value is not of the correct type', ... } ],
// >      data: undefined
// > }

console.log(validate(["one", "two", "three"], LIST(STRING())))
// > { success: true, errors: [], data: [ "one", "two", "three" ] }

console.log(validate([1, "two", 3], LIST(NUMBER())))
// > {
// >      success: false,
// >      errors: [ {
// >          message: 'Value is not of the correct type',
// >          location: '* > [1]'
// >          ...
// >      } ],
// >      data: undefined
// > }

console.log(validate([1, "two", []], LIST(STRING(), NUMBER(), LIST())))
// > { success: true, errors: [], data: [ 1, "two", [] ] }
// And yes we also can verify LIST() within LIST()

console.log(validate([1, "two", null], LIST(STRING(), NUMBER())))
// > {
// >      success: false,
// >      errors: [ { message: 'Value is not of the correct type', ... } ],
// >      data: undefined
// > }

const usernames = ["jack", "_jack", "-jack"]
console.log(validate(usernames, LIST(STRING(/^[a-zA-Z]/))))
// > {
// >     success: false,
// >     errors: [
// >         { message: 'Value is not of the correct type', ... },
// >         { message: 'Value is not of the correct type', ... }
// >     ],
// >     data: undefined
// > }
// Not every username matched /^[a-zA-Z]/

const codes = [34, 76, 92]
console.log(validate(codes, LIST(NUMBER(34, 76, 92))))
// > { success: true, errors: [], data: [ 34, 76, 92 ] }
// Every code matched items in [34, 76, 92]
```

## `OBJECT` function

The `OBJECT()` function is used to validate that data is a json object<br />
`OBJECT()` changes it's behaviour according to the parameters passed to it.

::: tip Parameters

| Type                        | Description                                                        |
| --------------------------- | ------------------------------------------------------------------ |
| `(empty)`                   | Checks if the input is a json object                               |
| `Record<string, Validator>` | Checks if the input's properties and values match the input schema |

:::

::: details TypeScript Source Code

```ts
/* OBJECT.ts */

export default <T extends Record<string, Validator<any>>>(rule_object?: T): /* ... */
```

:::

```ts
import {
	validate,
	STRING,
	NUMBER,
	BOOLEAN,
	NULL,
	UNDEFINED,
	OBJECT
} from "validate-any"

console.log(validate({ property: "value" }, OBJECT()))
// > { success: true, errors: [], data: { property: "value" } }
// Since { property: "value" } is an object, validate() returned true

console.log(validate({ property: "value" }, OBJECT({})))
// > {
// >     success: false,
// >     errors: [ { message: 'Object has unknown property which is defined', ... } ],
// >     data: undefined
// > }
// The rule of {} means the object must have no properties

console.log(validate({ property: "value" }, OBJECT({ property: STRING() })))
// > { success: true, errors: [], data: { property: "value" } }
// We set the OBJECT's params to an object with a property "property" and a value "value"
// Since "value" matches STRING(), validate() returned true

console.log(
	validate(
		{
			property: "value"
		},
		OBJECT({
			prop: STRING()
		})
	)
)
// > {
// >     success: false,
// >     errors: [
// >         { message: 'Object requires this property but is missing', ... },
// >         { message: 'Object has unknown property which is defined', ... }
// >     ],
// >     data: undefined
// > }
// Since there is no property for the type validation "prop", we got an error
// Since there is no type validation for the property "property", we got an error

console.log(
	validate(
		{
			property: "value",
			layer: {
				deepProperty: ["", 0, null, undefined, false]
			}
		},
		OBJECT({
			property: STRING(),
			layer: OBJECT({
				deepProperty: LIST(
					STRING(),
					NUMBER(0),
					NULL(),
					UNDEFINED(),
					BOOLEAN(false)
				)
			})
		})
	)
)
// > {
// >      success: true,
// >      errors: [],
// >      data: { property: 'value', layer: { deepProperty: [Array] } }
// > }
// We can even nest OBJECT() in OBJECT()
```

## `OR` function

The `OR()` function is used to validate that data matches any of the schemas passed within it's parameters<br />
`OR()` takes in multiple parameters, which are all validation schemas.

::: tip Parameters

| Type             | Description                                         |
| ---------------- | --------------------------------------------------- |
| `...Validator[]` | Checks if the input matches any of these validators |

:::

::: details TypeScript Source Code

```ts
/* OR.ts */

export default <T extends Validator<any>[]>(...rules: T): /* ... */
```

:::

```ts
import { validate, OR, STRING, NUMBER, BOOLEAN } from "validate-any"

console.log(validate("string", OR()))
// > Error: Expected developer to provide at least 1 rule for the OR operation
// An OR operation only works with at least one input

console.log(validate("string", OR(STRING(), NUMBER())))
// > { success: true, errors: [], data: "string" }

console.log(validate("string", OR(BOOLEAN(), NUMBER())))
// > {
// >     success: false,
// >     errors: [ { message: 'Value does not match any of the validators defined', ... } ],
// >     data: undefined
// > }
```

## `CLASS` function

The `CLASS()` function is used to validate that data is an instance of the class specified<br />
Just like `NULL()` and `UNDEFINED()`, `CLASS()` doesn't allow variations of the parameters

::: tip Parameters

| Type    | Description                                      |
| ------- | ------------------------------------------------ |
| `Class` | Checks if the input is an instance of this class |

:::

::: details TypeScript Source Code

```ts
/* CLASS.ts */

export default <T extends new () => any>(clazz: T): /* ... */
```

:::

```ts
import { validate, CLASS } from "validate-any"

class X {}
class Y {}

console.log(validate(new X(), CLASS(X)))
// > { success: true, errors: [], data: X {} }

console.log(validate(new X(), CLASS(Y)))
// > {
// >     success: false,
// >     errors: [ { message: 'Value isn't an instance of the defined class', ... } ],
// >     data: undefined
// > }
```
