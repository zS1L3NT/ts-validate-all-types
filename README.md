# validate-all-types
[![Build Status](https://travis-ci.org/rodgc/validate-all-types.svg?branch=master)](https://travis-ci.org/rodgc/validate-all-types)
[![npm version](https://badge.fury.io/js/validate-all-types.svg)](https://badge.fury.io/js/validate-all-types)


## What is `validate-all-types`?
This package is a type validator mainly for Typescript (also works with Javascript).
Ever faced those issues where you're trying to make sure a type `any` is an instance of an interface? This is the issue this package was designed to solve.
With this package, you can safely assert the type for an object and return customised errors if the types are incorrect


## Installation & Usage
> $ npm install validate-all-types

or

> $ yarn add validate-all-types

then import the module like this:
```ts
// Typescript
import { validate } from "validate-all-types"

// Javascript
const { validate } = require("validate-all-types")
```
Typescript typings are automatically included so there's no need to install anything like `@types/validate-all-types` !


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
errors   | `string[]` | The list of corrections to make if any

## Making a rule

There are infinite combinations of rules we can make. The complexity of the rule only depends on how much code you are
willing to write.

### Validation basics with a string

Here is how to validate a string

```ts
console.log(validate("string", STRING()))
// > { success: true, errors: [] }

console.log(validate(0, STRING()))
// > { success: false, errors: [ '*: Expected value to be of type: string' ] }
```

Notice that in the error message, the root element is called `*`
because as mentioned earlier, if we don't pass a third parameter into the `validate()` function, it names the root `*` by default.

The function `STRING` with nothing in the parameters represents a type string.
This method can also take in items in the parameters:

Type          | Description
--------------|------------------------------------------------------
`(empty)`     | validates if the input is a string
`RegExp`      | validates if the input is a string and matches the RegExp
`...string[]` | validates if the input is a string and matches any of the given strings
<br>

```ts
import { validate, STRING } from "validate-all-types"

console.log(validate("string", STRING()))
// > { success: true, errors: [] }
// This returned true because "string" is a string

console.log(validate(0, STRING()))
// > { success: false, errors: [ '*: Expected value to be of type: string' ] }
// This returned false because 0 is not a string

console.log(validate("string", STRING(/^string$/)))
// > { success: true, errors: [] }
// This returned true because "string" matches the RegExp /^string$/

console.log(validate("string", STRING(/^something-else$/)))
// > { success: false, errors: [ '*: Expected value to match RegExp: /^something-else$/' ] }
// This returned false because "string" didn't match the RegExp /^something-else$/

console.log(validate("string", STRING("does", "the", "string", "match", "?")))
// > { success: true, errors: [] }
// This returned true because "string" was passed into STRING() as a parameter

console.log(validate("string", STRING("doesn't", "match"), "my-string"))
// > { success: false, errors: [ `my-string: Expected value to be one of the strings: ["doesn't","match"]` ] }
// This returns false because "string" wasn't passed into STRING() as a parameter
// Since I passed a third parameter to the validate function, the root got renamed from * to my-string
```

### Validating a number with `NUMBER()`
Because `STRING()` validates strings, it's obvious that `NUMBER()` validates numbers. `NUMBER()` works the same was as `STRING()` except allows a different set of parameters:

Type          | Description
--------------|------------------------------------------------------
`(empty)`     | validates if the input is a number
`...number[]` | validates if the input is a number and matches any of the given numbers
<br>

```ts
import { validate, NUMBER } from "validate-all-types"

console.log(validate(3, NUMBER()))
// > { success: true, errors: [] }

console.log(validate("string", NUMBER()))
// > { success: false, errors: [ '*: Expected value to be of type: number' ] }

console.log(validate(3, NUMBER(1, 2, 3, 4, 5)))
// > { success: true, errors: [] }

console.log(validate(3, NUMBER(6, 7, 8, 9, 10)))
// > { success: false, errors: [ '*: Expected value to be one of the numbers: [6,7,8,9,10]' ] }
```

### Validating a boolean with `BOOLEAN()`
`BOOLEAN()` allows comparison of booleans only

Type      | Description
----------|---------------------------------------------------------------
`(empty)` | validates if the input is a boolean
`boolean` | validates if the input is a boolean and if the booleans are equal
<br>

```ts
import { validate, BOOLEAN } from "validate-all-types"

console.log(validate(true, BOOLEAN()))
// > { success: true, errors: [] }

console.log(validate("string", BOOLEAN()))
// > { success: false, errors: [ '*: Expected value to be of type: boolean' ] }

console.log(validate(true, BOOLEAN(true)))
// > { success: true, errors: [] }

console.log(validate(false, BOOLEAN(true)))
// > { success: false, errors: [ '*: Expected value to be: true' ] }
```

### Validating null with `NULL()`
`NULL()` doesn't allow variations of the parameters

Type       | Description
-----------|------------------------------------------------------
`(empty)`  | validates if the input is a null
<br>

```ts
import { validate, NULL } from "validate-all-types"

console.log(validate(null, NULL()))
// > { success: true, errors: [] }

console.log(validate(undefined, NULL()))
// > { success: false, errors: [ '*: Expected value to be: null' ] }
```

### Validating undefined with `UNDEFINED()`
Just like `NULL()`, `UNDEFINED()` doesn't allow variations of the parameters

Type        | Description
------------|------------------------------------------------------
(empty)     | validates if the input is a undefined
<br>

```ts
import { validate, UNDEFINED } from "validate-all-types"

console.log(validate(undefined, UNDEFINED()))
// > { success: true, errors: [] }

console.log(validate(null, UNDEFINED()))
// > { success: false, errors: [ '*: Expected value to be: undefined' ] }
```

### Validating a list with `LIST()`
This one's a bit more complicated. `LIST()` allows a few sets of parameters:

Type             | Description
-----------------|------------------------------------------------------
`(empty)`        | validates if the input is a list
`...Validator[]` | validates if the input is a list and checks if all items in the list match at least 1 of the Rules stated
<br>

```ts
import { validate, LIST, STRING, NUMBER } from "validate-all-types"

console.log(validate([1, 2, 3, 4, 5], LIST()))
// > { success: true, errors: [] }

console.log(validate({ property: "value" }, LIST()))
// > { success: false, errors: [ '*: Expected value to be of type: array' ] }

console.log(validate(["one", "two", "three"], LIST(STRING())))
// > { success: true, errors: [] }

console.log(validate([1, "two", 3], LIST(NUMBER())))
// > { success: false, errors: [ '* > [1]: Expected value to be of type: number' ] }

console.log(validate([1, "two", []], LIST(STRING(), NUMBER(), LIST())))
// > { success: true, errors: [] }
// And yes we also can verify LIST() within LIST()

console.log(validate([1, "two", null], LIST(STRING(), NUMBER())))
// > { success: false, errors: [ '* > [2]: Expected value to be of type: string | number' ] }

const usernames = ["jack", "_jack", "-jack"]
console.log(validate(usernames, LIST(STRING(/^[a-zA-Z]/)))) 
// > {
// >     success: false,
// >     errors: [
// >         '* > [1]: Expected value to be of type: /^[a-zA-Z]/',
// >         '* > [2]: Expected value to be of type: /^[a-zA-Z]/''
// >     ]
// > }
// Not every username matched /^[a-zA-Z]/

const codes = [34, 76, 92]
console.log(validate(codes, LIST(NUMBER(34, 76, 92))))
// > { success: true, errors: [] }
// Every code matched items in [34, 76, 92]
```

This way, we can make checking of list types much more detailed

### Validating an object with `OBJECT()`

We can use `OBJECT()` to validate objects.
`OBJECT()` only allows 1 optional parameter which maps out what the properties will look like

```ts
import { validate, OBJECT } from "validate-all-types"

console.log(validate({ property: "value" }, OBJECT()))
// > { success: true, errors: [] }
// Since { property: "value" } is an object, validate() returned true

console.log(validate({ property: "value" }, OBJECT({})))
// > {
// >     success: false,
// >     errors: [ '* > name: Value has unknown property: property' ]
// > }
// The rule of {} means the object must have no properties

console.log(validate(
    { property: "value" },
    OBJECT({ property: STRING() }
)))
// > { success: true, errors: [] }
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
// >         '*: Expected value to contain property: prop',
// >         '*: Value has unknown property: property'
// >     ]
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
// > { success: true, errors: [] }
// We can even nest OBJECT() in OBJECT()
```

### Validating the or operation with `OR()`

If you want either of a few rules to match, use the `OR()` operator. This function takes multiple parameters:

Type             | Description
-----------------|-------------
`...Validator[]` | A list of rules to test on the input
<br>

```ts
import { validate, OR, STRING, NUMBER, BOOLEAN } from "validate-all-types"

console.log(validate("string", OR()))
// > Error: *: Expected developer to provide at least 1 rule for the OR operation
// An OR operation only works with at least one input

console.log(validate(
    "string",
    OR(STRING(), NUMBER())
))
// > { success: true, errors: [] }

console.log(validate(
    "string",
    OR(BOOLEAN(), NUMBER())
))
// > {
// >     success: false,
// >     errors: [ '*: Expected value to match at least one of the given rules: boolean | number' ]
// > }
```


## Custom error messages

You may not like the default error messages we provide you when a patter matching fails. Because of this, there is a
function to set up your own custom error messages to your own liking.

Error messages can be very specific to which exact value was validated wrongly. Because of this, this package takes the
default error template and replaces specified parts of the message with custom values. Here's what I mean:

```ts
import { NUMBER, setup_validate_messages, validate } from "validate-all-types"

// Call this function this way to set up the new error messages
setup_validate_messages({
    not_type: `Bad type, expected %type%`
})

console.log(validate("string", NUMBER()))
// > { success: false, errors: [`Bad type, expected number`] } 
```

In the example above, `%type%` was replaced with `number` because the expected type was `number`. Below is the table of
all the possible error messages you could change

Key                  | Changeable value | Default                                                              | Description
---------------------|------------------|----------------------------------------------------------------------|------------
`not_type`           | `%type%`         | `"Expected value to be of type: %type%"`                             | Used when a type is not as defined
`not_value`          | `%value%`        | `"Expected value to be: %value%"`                                    | Used when a value is not as defined
`not_regex_match`    | `%regex%`        | `"Expected value to match RegExp: %regex%"`                          | Used when a string doesn't match the regex defined
`not_among_strings`  | `%strings%`      | `"Expected value to be one of the strings: %strings%"`               | Used when a string is not among the list of strings defined
`not_among_numbers`  | `%numbers%`      | `"Expected value to be one of the numbers: %numbers%"`               | Used when a number is not among the list of numbers defined
`not_among_rules`    | `%rules%`        | `"Expected value to match at least one of the given rules: %rules%"` | Used when a value doesn't match any rule the list of rules defined
`missing_property`   | `%property%`     | `"Expected value to contain property: %property%"`                   | Used when an object is missing a property defined
`unknown_property`   | `%property%`     | `"Value has unknown property: %property%"`                           | Used when an object has an property not defined

## Using `validate_express` with Express.js

You can also import the module as a middleware to be used with express. This way, you can verify the types of
the `req.body` or `req.params`
before invalid types mess your code up

```ts
import { validate_express, OBJECT, STRING } from "validate-all-types"

// ----snip----

app.post("/body",
    validate_express("body", OBJECT({ usnm: STRING(), pswd: STRING() })),
    (req, res) => {
        const { usnm, pswd } = req.body as { usnm: string, pswd: string }
        console.log(`Username: ${usnm}`, `Password: ${pswd}`)
        res.end()
    }
)

// ----snip----
```

The `validate_express` takes in 2 parameters:

Number | Type               | Description
-------|--------------------|-------------
`1`    | `"body" \| "rule"` | Can either verify the `req.body` or `req.params` object
`2`    | `Validator`        | Rule to compare the object with

Because of the middleware, in Typescript you can now safely use type assertions.
Also, now for both Typescript and Javascript, you can safely use the variables like
they are the defined types and not have to worry about invalid types crashing your server!