import { validate, STRING, NUMBER, BOOLEAN, LIST, OBJECT, NULL, UNDEFINED, AND, OR, NOT, iPattern } from "./index"

const assert = (data: any, pattern: iPattern, correct: boolean) => {
	const result = validate(data, pattern)
	if (result.success !== correct) {
		console.error(result.errors)
		throw new Error()
	}
}

// region string
assert("hi", STRING(), true)
assert("hi", STRING("hi"), true)
assert("hi", STRING("bye"), false)
assert(123, STRING("123"), false)
console.log("Validators: string    ✅")
// endregion

// region number
assert(123, NUMBER(), true)
assert(123, NUMBER(123), true)
assert(123, NUMBER(321), false)
assert(123, STRING("123"), false)
assert(0, NULL(), false)
assert(0, UNDEFINED(), false)
console.log("Validators: number    ✅")
// endregion

// region boolean
assert(true, BOOLEAN(), true)
assert(true, BOOLEAN(true), true)
assert(true, BOOLEAN(false), false)
assert(true, STRING("true"), false)
assert(true, NUMBER(1), false)
console.log("Validators: BOOLEAN   ✅")
// endregion

// region list
assert([], LIST(), true)
assert({}, LIST(), false)
assert(["hi"], LIST(), true)
assert(["hi"], LIST(STRING()), true)
assert(["hi"], LIST(STRING("hi")), true)
assert(["hi"], LIST(STRING("bye")), false)
assert([123], LIST(STRING()), false)
assert([123], LIST(STRING(), NUMBER()), true)
assert([{ name: "Joe" }], LIST(STRING()), false)
assert([{ name: "Joe" }], LIST(OBJECT({ name: STRING() })), true)
assert([], NULL(), false)
assert([], UNDEFINED(), false)
console.log("Validators: list      ✅")
// endregion

// region object
assert({}, OBJECT(), true)
assert([], OBJECT(), false)
assert({}, OBJECT({ name: STRING() }), false)
assert({ name: "" }, OBJECT({}), false)
assert({}, OBJECT({ name: OR(STRING(), UNDEFINED()) }), true)
assert({ age: 12 }, OBJECT({ name: STRING() }), false)
assert({ notes: ['cool'] }, OBJECT({ notes: LIST() }), true)
assert({ notes: ['cool'], settings: {} }, OBJECT({ notes: LIST(), settings: OBJECT({}) }), true)
assert({ notes: ['cool'], settings: {} }, OBJECT({ notes: LIST(), settings: OBJECT({ is_admin: BOOLEAN() }) }), false)
console.log("Validators: object    ✅")
// endregion

// region null
assert(null, NULL(), true)
assert(undefined, NULL(), false)
assert(0, NULL(), false)
assert("", NULL(), false)
assert([], NULL(), false)
console.log("Validators: null      ✅")
// endregion

// region undefined
assert(undefined, UNDEFINED(), true)
assert(null, UNDEFINED(), false)
assert(0, UNDEFINED(), false)
assert("", UNDEFINED(), false)
assert([], UNDEFINED(), false)
console.log("Validators: undefined ✅")
// endregion

// region and
assert(0, AND(NOT(NULL()), NOT(UNDEFINED())), true)
assert(null, AND(NULL(), NOT(OBJECT()), NOT(STRING())), true)
assert(null, AND(NOT(NULL())), false)
assert({}, AND(NOT(NULL()), OBJECT()), true)
console.log("Validators: AND       ✅")
// endregion

// region or
assert(0, OR(STRING(), NUMBER()), true)
assert(0, OR(NULL(), UNDEFINED()), false)
assert(0, OR(STRING("hi", "bye"), NUMBER(1, 2)), false)
assert(null, OR(NOT(NULL()), UNDEFINED()), false)
console.log("Validators: or        ✅")
// endregion

// region not
assert(0, NOT(NULL()), true)
assert(null, NOT(NOT(NOT(NOT(NULL())))), true)
console.log("Validators: not       ✅")
// endregion
