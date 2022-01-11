# validate-any

[![Build Status](https://travis-ci.org/rodgc/validate-any.svg?branch=master)](https://travis-ci.org/rodgc/validate-any)
[![npm version](https://badge.fury.io/js/validate-any.svg)](https://badge.fury.io/js/validate-any)

## What is `validate-any`?

This package is a type validator mainly for Typescript (also works with Javascript). Ever faced those issues where
you're trying to make sure a type `any` is an instance of an interface? This is the issue this package was designed to
solve. With this package, you can safely assert the type for an object and return customised errors if the types are
incorrect

## Installation & Usage

> $ npm install validate-any

or

> $ yarn add validate-any

then import the module like this:
```ts
// Typescript
import { validate } from "validate-any"

// Javascript
const { validate } = require("validate-any")
```

Typescript typings are automatically included so there's no need to install anything like `@types/validate-any` !


## How the `validate` function works
The `validate` object we imported earlier is a function which can take 2 (3: optional) parameters.

### `validate` parameters:
Number | Type       | Description
-------|------------|------------------------------------------------------
`1`    | `any`      | The object we are checking
`2`    | `Validator`| A specific rule to compare the object to (more about this later)
`3`    | `string?`  | The name of the root object when logs display errors. Defaults to `*` as root
--------------------------------------------------------------------------

The type `Validator` is something you don't need to worry about. Just know that it is the Typescript type for a rule.
Rules can look like `STRING()` or `NUMBER()`.

### `validate` returns an object containing:

Property | Type       | Description
---------|------------|---------------------------------------------------------
success  | `boolean`  | Whether the validation of the object was a success or failure. `true` if success, `false` if failure
errors   | `iValidationError[]` | The list of corrections to make if any
data     | `T`        | **The data you passed in with type annotations from the schema you passed in**

### `iValidationError` is the data type for an error
Property | Type     | Description
---------|----------|------------
location | `string` | Where in the object did an error occur. E.g. "* > settings > wallpaper"
message  | `string` | Description of what the error is
expected | `string` | The expected type of value
value    | `T`      | The value given

In the examples below, you will see in the error object I only show the error message and display a "..." after it.<br>
This is because I don't want to display unnecessary information.<br>
However, every single error will have all the properties defined here

Also do note that the location started with a `*`.<br>
This is the name of the root defined [here](#validate-parameters)

## Making a rule

There are infinite combinations of rules we can make. The complexity of the rule only depends on how much code you are
willing to write.

### Validation basics with `STRING()`

Here is how to validate a string

```ts
console.log(validate("string", STRING()))
// > { success: true, errors: [], data: "string" }

console.log(validate(0, STRING()))
// > {
// >      success: false,
// >      errors: [ { message: 'Value is not of the correct type', ... } ],
// >      data: undefined
// > }
```

The function `STRING` with nothing in the parameters represents a type string.
This method can also take in items in the parameters:

Type          | Description
--------------|------------------------------------------------------
`(empty)`     | validates if the input is a string
`RegExp`      | validates if the input is a string and matches the RegExp
`...string[]` | validates if the input is a string and matches any of the given strings
<br>

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
// >      errors: [ { message: `Value doesn't match anything in the defined set of strings`, ... } ],
// >      data: undefined
// > }
// This returns false because "string" wasn't passed into STRING() as a parameter
```

### Validating a number with `NUMBER()`
Because `STRING()` validates strings, it's obvious that `NUMBER()` validates numbers. `NUMBER()` works the same was as `STRING()` except allows a different set of parameters:

Type          | Description
--------------|------------------------------------------------------
`(empty)`     | validates if the input is a number
`...number[]` | validates if the input is a number and matches any of the given numbers
<br>

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
// >      errors: [ { message: 'Value doesn't match anything in the defined set of numbers', ... } ],
// >      data: undefined
// > }
```

### Validating a boolean with `BOOLEAN()`
`BOOLEAN()` allows comparison of booleans only

Type      | Description
----------|---------------------------------------------------------------
`(empty)` | validates if the input is a boolean
`boolean` | validates if the input is a boolean and if the booleans are equal
<br>

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

### Validating null with `NULL()`
`NULL()` doesn't allow variations of the parameters

Type       | Description
-----------|------------------------------------------------------
`(empty)`  | validates if the input is a null
<br>

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

### Validating undefined with `UNDEFINED()`
Just like `NULL()`, `UNDEFINED()` doesn't allow variations of the parameters

Type        | Description
------------|------------------------------------------------------
(empty)     | validates if the input is a undefined
<br>

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

### Validating a list with `LIST()`
This one's a bit more complicated. `LIST()` allows a few sets of parameters:

Type             | Description
-----------------|------------------------------------------------------
`(empty)`        | validates if the input is a list
`...Validator[]` | validates if the input is a list and checks if all items in the list match at least 1 of the Rules stated
<br>

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
// >      errors: [ { message: 'Value is not of the correct type', ... } ],
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

This way, we can make checking of list types much more detailed

### Validating an object with `OBJECT()`

We can use `OBJECT()` to validate objects.
`OBJECT()` only allows 1 optional parameter which maps out what the properties will look like

```ts
import { validate, OBJECT } from "validate-any"

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

console.log(validate(
    { property: "value" },
    OBJECT({ property: STRING() }
)))
// > { success: true, errors: [], data: { property: "value" } }
// We set the OBJECT's params to an object with a property "property" and a value "value"
// Since "value" matches STRING(), validate() returned true

console.log(validate({
        property: "value"
    }, OBJECT({
        prop: STRING()
    })
))
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

console.log(validate(
    {
        property: "value",
        layer: {
            deepProperty: ["", 0, null, undefined, false]
        }
    },
    OBJECT({
        property: STRING(),
        layer: OBJECT({
            deepProperty: LIST(STRING(), NUMBER(0), NULL(), UNDEFINED(), BOOLEAN(false))
        })
    })
))
// > {
// >      success: true,
// >      errors: [],
// >      data: { property: 'value', layer: { deepProperty: [Array] } }
// > }
// We can even nest OBJECT() in OBJECT()
```

### Validating the or operation with `OR()`

If you want either of a few rules to match, use the `OR()` operator. This function takes multiple parameters:

Type             | Description
-----------------|-------------
`...Validator[]` | A list of rules to test on the input
<br>

```ts
import { validate, OR, STRING, NUMBER, BOOLEAN } from "validate-any"

console.log(validate("string", OR()))
// > Error: Expected developer to provide at least 1 rule for the OR operation
// An OR operation only works with at least one input

console.log(validate(
    "string",
    OR(STRING(), NUMBER())
))
// > { success: true, errors: [], data: "string" }

console.log(validate(
    "string",
    OR(BOOLEAN(), NUMBER())
))
// > {
// >     success: false,
// >     errors: [ { message: 'Value does not match any of the validators defined', ... } ],
// >     data: undefined
// > }
```

## Using `withValidBody` with a Express or Next

You can also import the module as a middleware to be used with Express or Next.
This way, you can verify the types of the `req.body` before invalid types mess your code up

```ts
import { OBJECT, STRING, withValidBody } from "validate-any"

// Express
app.post(
	"/body",
	withValidBody(OBJECT({ usnm: STRING(), pswd: STRING() }), (req, res) => {
		const { usnm, pswd } = req.body
		console.log(`Username: ${usnm}`, `Password: ${pswd}`)
		res.end()
	})
)

// Next
export default withValidBody(
	OBJECT({ usnm: STRING(), pswd: STRING() }),
	(req, res) => {
		const { usnm, pswd } = req.body
		console.log(`Username: ${usnm}`, `Password: ${pswd}`)
		res.end()
	}
)
```

The `withValidBody` takes in 2 parameters:

Number | Type               | Description
-------|--------------------|-------------
`1`    | `Validator`        | Rule to compare the `req.body` with
`2`    | `handler`          | Handler to handle the request if it works

Because of the middleware, in Typescript you can now safely use type assertions.
Also, now for both Typescript and Javascript, you can safely use the variables like
they are the defined types and not have to worry about invalid types crashing your server!