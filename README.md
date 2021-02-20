# validate-all-types
[![Build Status](https://travis-ci.org/rodgc/validate-all-types.svg?branch=master)](https://travis-ci.org/rodgc/validate-all-types)
[![npm version](https://badge.fury.io/js/validate-all-types.svg)](https://badge.fury.io/js/validate-all-types)


## What is `validate-all-types`?
This package is a type validator mainly for Typescript (also works with Javascript). Ever faced those issues where you're trying to make sure a type `any` is an instance of an interface? This is the issue this package was designed to solve. With this package, you can safely assert the type for an object and return customised errors if the types are incorrect

## Installation
> $ npm install validate-all-types

or

> $ yarn add validate-all-types

then import the module like this:
```js
// Typescript
import Check, { ... } from "validate-all-types"

// Javascript
// ...In testing...
```
Typescript typings are automatically included so there's no need to install anything like `@types/validate-all-types` !


## How the Check function works
The `Check` object we imported earlier is a function which can take 2 (3: optional) parameters.

### Check's parameters:
Number | Type      | Description
-------|-----------|-------------------
1      | any       | The object we are checking
2      | ITpattern | A specific pattern to compare the object to (more about this later)
3      | string?   | The name of the root object when logs display errors. Defaults to `*` as root

The type `ITpattern` is something you don't need to worry about. Just know that it is the Typescript type for a pattern. Patterns can look like `Tstring()` or `Tnumber()`. Because there are quite a few Patterns, we will generalise them by calling them `T{type}()` functions

### Check returns a list of:
Index | Type     | Description
------|----------|---------------------------------------------------------
0     | boolean  | Whether the validation of the object was a success or failure. `true` if success, `false` if failure
1     | string[] | The list of corrections to make if any


## Making a pattern
There are infinite combinations of patterns we can make. The complexity of the pattern only depends on how much code you are willing to write.

### Validation basics with a string
Because you have no idea how `T{type}()` functions works, I will use the string example to teach you exactly how the `T{type}()` functions work in full detail so this first chapter may be a bit long winded... All the `T{type}()` functions are importable from the module

Here is how to validate a string
```ts
console.log(Check("string", Tstring()))
// > [ true, [] ]

console.log(Check(0, Tstring()))
// > [ false, [ '*: Expected (*) to be of type `string`' ] ]
```

Notice that in the error message, the root element is called `*` because as mentioned earlier, if we don't pass a third parameter into the Check() function, it names the root `*` by default.

The function `Tstring` with nothing in the parameters represents a Type string (T for type and string for string, therefore: Tstring). This method can also take in items in the parameters:

Type        | Description
------------|------------------------------------------------------
(empty)     | Checks if the input is a string
RegExp      | Checks if the input is a string and matches the RegExp
...string[] | Checks if the input is a string and matches any of the given strings

```ts
import Check, { Tstring } from "validate-all-types"

console.log(Check("string", Tstring()))
// > [ true, [] ]
//  This returned true because "string" is a string

console.log(Check(0, Tstring()))
// > [ false, [ '*: Expected (*) to be of type `string`' ] ]
//  This returned false because 0 is not a string

console.log(Check("string", Tstring(/^string$/)))
// > [ true, [] ]
//  This returned true because "string" matches the RegExp /^string$/

console.log(Check("string", Tstring(/^something-else$/)))
// > [ false, [ '*: Expected (*) to match RegExp (/^something-else$/)' ] ]
//  This returned false because "string" didn't match the RegExp /^something-else$/

console.log(Check("string", Tstring("does", "the", "string", "match", "?")))
// > [ true, [] ]
//  This returned true because "string" was passed into Tstring() as a parameter

console.log(Check("string", Tstring("doesn't", "match"), "my-string"))
// > [ false, [ `my-string: Expected (my-string) to be in (["doesn't","match"])` ] ]
//  This returns false because "string" wasn't passed into Tstring() as a parameter
// Since I passed a third parameter to the Check function, the root got renamed
```

Whew! That was quite a steep learning curve... Now since you already know the basics of how `Check()` and `Tstring()` works, it should be much easier from here on

### Validating a number with `Tnumber()`
Because `Tstring()` validates strings, it's obvious that `Tnumber()` validates numbers. `Tnumber()` works the same was as `Tstring()` except allows a different set of parameters:

Type        | Description
------------|------------------------------------------------------
(empty)     | Checks if the input is a number
...number[] | Checks if the input is a number and matches any of the given numbers

```ts
import Check, { Tnumber } from "validate-all-types"

console.log(Check(3, Tnumber()))
// > [ true, [] ]

console.log(Check("string", Tnumber()))
// > [ false, [ '*: Expected (*) to be of type `number`' ] ]

console.log(Check(3, Tnumber(1, 2, 3, 4, 5)))
// > [ true, [] ]

console.log(Check(3, Tnumber(6, 7, 8, 9, 10)))
// > [ false, [ '*: Expected (*) to be in ([6,7,8,9,10])' ] ]
```

### Validating a boolean with `Tboolean()`
`Tboolean()` allows comparison of booleans only
Type    | Description
--------|---------------------------------------------------------------
(empty) | Checks if the input is a boolean
boolean | Checks if the input is a boolean and if the booleans are equal

```ts
import Check, { Tboolean } from "validate-all-types"

console.log(Check(true, Tboolean()))
// > [ true, [] ]

console.log(Check("string", Tboolean()))
// > [ false, [ '*: Expected (*) to be of type `boolean`' ] ]

console.log(Check(true, Tboolean(true)))
// > [ true, [] ]

console.log(Check(false, Tboolean(true)))
// > [ false, [ '*: Expected (*) to be `true`' ] ]
```

### Validating null with `Tnull()`
`Tnull()` doesn't allow variations of the parameters
Type        | Description
------------|------------------------------------------------------
(empty)     | Checks if the input is a null

```ts
import Check, { Tnull } from "validate-all-types"

console.log(Check(null, Tnull()))
// > [ true, [] ]

console.log(Check(undefined, Tnull()))
// > [ false, [ '*: Expected (*) to be of type `null`' ] ]
```

### Validating undefined with `Tundefined()`
Just like `Tnull()`, `Tundefined()` doesn't allow variations of the parameters
Type        | Description
------------|------------------------------------------------------
(empty)     | Checks if the input is a undefined

```ts
import Check, { Tundefined } from "validate-all-types"

console.log(Check(undefined, Tundefined()))
// > [ true, [] ]

console.log(Check(null, Tundefined()))
// > [ false, [ '*: Expected (*) to be of type `undefined`' ] ]
```

### Validating a list with `Tlist()`
This one's a bit more complicated. `Tlist()` allows a few sets of parameters:

Type           | Description
---------------|------------------------------------------------------
(empty)        | Checks if the input is a list
...ITPattern[] | Checks if the input is a list and checks if all items in the list match at least 1 of the Patterns stated

You can put in `T{type}()` functions as parameters for `Tlist()` so as to do stricter checking of types

```ts
import Check, { Tlist, Tstring, Tnumber } from "validate-all-types"

console.log(Check([1, 2, 3, 4, 5], Tlist()))
// > [ true, [] ]

console.log(Check({ property: "value" }, Tlist()))
// > [ false, [ '*: Expected (*) to be of type `array`' ] ]

console.log(Check(["one", "two", "three"], Tlist(Tstring())))
// > [ true, [] ]

console.log(Check([1, "two", 3], Tlist(Tnumber())))
// > [ false, [ '* > [1]: Expected [1] to be of pattern defined' ] ]

console.log(Check([1, "two", []], Tlist(Tstring(), Tnumber(), Tlist())))
// > [ true, [] ]
// And yes we also can verify Tlist() within Tlist()

console.log(Check([1, "two", null], Tlist(Tstring(), Tnumber())))
// > [ false, [ '* > [2]: Expected [2] to be of pattern defined' ] ]

const usernames = ["jack", "_jack", "-jack"]
console.log(Check(usernames, Tlist(Tstring(/^[a-zA-Z]/)))) 
// > [
// >     false,
// >     [
// >         '* > [1]: Expected [1] to be of pattern defined',
// >         '* > [2]: Expected [2] to be of pattern defined'
// >     ]
// > ]
// Not every username matched /^[a-zA-Z]/

const codes = [34, 76, 92]
console.log(Check(codes, Tlist(Tnumber(34, 76, 92))))
// > [ true, [] ]
// Every code matched items in [34, 76, 92]
```

This way, we can make checking of list types much more detailed

### Validating an object with `Tobject()`
Last but not least, in fact most importantly, we can use `Tobject()` to validate objects. Tobject only allows 1 optional parameter which maps out what the inner properties will look like

```ts
import Check, { Tobject } from "validate-all-types"

console.log(Check({ property: "value" }, Tobject()))
// > [ true, [] ]
// Since { property: "value" } is an object, Check() returned true

console.log(Check(
	{ property: "value" },
	Tobject({ property: Tstring() }
)))
// > [ true, [] ]
// We set the Tobject's params to an object with a property "property" and a value "value"
// Since "value" matches Tstring(), Check() returned true

console.log(Check(
	{
		property: "value"
	},
	Tobject({
		prop: Tstring()
	})
))
// > [
// >     false,
// >     [
// >         '*: Expected (*) to contain property (prop)',
// >         '* > property: No type definitions for (property)'
// >     ]
// > ]
// Since there is no property for the type validation "prop", we got an error
// Since there is no type validation for the property "property", we got an error

console.log(Check(
	{
		property: "value",
		layer: {
			deepProperty: ["", 0, null, undefined, false]
		}
	},
	Tobject({
		property: Tstring(),
		layer: Tobject({
			deepProperty: Tlist(Tstring(), Tnumber(0), Tnull(), Tundefined(), Tboolean(false))
		})
	})
))
// > [ true, [] ]
// We can even nest Tobject() in Tobject()
```

## Using `validate-all-types` with Express
You can also import a middleware to be used with express. This way, you can verify the types of the `req.body` or `req.params` before invalid types mess your server up

```ts
import Check, { ValidateRequest } from "validate-all-types"

// ----snip----

app.post("/body",
	ValidateRequest("body", Tobject({ usnm: Tstring(), pswd: Tstring() })),
	(req, res) => {
		const { usnm, pswd } = req.body as { usnm: string, pswd: string }
		console.log(`Username: ${usnm}`, `Password: ${pswd}`)
		res.end()
	}
)

// ----snip----
```

The ValidateRequest takes in 2 parameters:
Number | Type               | Description
-------|--------------------|-------------
1      | "body" \| "params" | Can either verify the `req.body` or `req.params` object
2      | ITpattern          | Pattern to compare the object with

Because of the middleware, in Typescript you can now safely use type assertions. Also, now for both Typescript and Javascript, you can safely use the variables like they are the defined types and not have to worry about invalid types crashing your server!