import Validator from "./classes/Validator"
import {
	BOOLEAN,
	LIST,
	NULL,
	NUMBER,
	OBJECT,
	OR,
	STRING,
	UNDEFINED,
	validate
} from "./index"

const assert = <T>(
	data: any,
	rule: Validator<T>,
	correct: boolean,
	errors: number = 0
) => {
	const result = validate(data, rule)
	if (result.success === correct) {
		if (result.errors.length === errors) {
			// Correct
		} else {
			throw new Error(
				`Expected ${errors} errors, got ${result.errors.length} errors`
			)
		}
	} else {
		throw new Error(result.errors.toString())
	}
}

// region string
assert("hi", STRING(), true)
assert("hi", STRING("hi"), true)
assert("hi", STRING("bye"), false, 1)
assert(123, STRING("123"), false, 1)
console.log("Validators: string    ✅")
// endregion

// region number
assert(123, NUMBER(), true)
assert(123, NUMBER(123), true)
assert(123, NUMBER(321), false, 1)
assert(123, STRING("123"), false, 1)
assert(0, NULL(), false, 1)
assert(0, UNDEFINED(), false, 1)
console.log("Validators: number    ✅")
// endregion

// region boolean
assert(true, BOOLEAN(), true)
assert(true, BOOLEAN(true), true)
assert(true, BOOLEAN(false), false, 1)
assert(true, STRING("true"), false, 1)
assert(true, NUMBER(1), false, 1)
console.log("Validators: BOOLEAN   ✅")
// endregion

// region list
assert([], LIST(), true)
assert({}, LIST(), false, 1)
assert(["hi"], LIST(), true)
assert(["hi"], LIST(STRING()), true)
assert(["hi"], LIST(STRING("hi")), true)
assert(["hi"], LIST(STRING("bye")), false, 1)
assert([123], LIST(STRING()), false, 1)
assert([123], LIST(STRING(), NUMBER()), true)
assert([{ name: "Joe" }], LIST(STRING()), false, 1)
assert([{ name: "Joe" }], LIST(OBJECT({ name: STRING() })), true)
assert([], NULL(), false, 1)
assert([], UNDEFINED(), false, 1)
console.log("Validators: list      ✅")
// endregion

// region object
assert({}, OBJECT(), true)
assert([], OBJECT(), false, 1)
assert({}, OBJECT({ name: STRING() }), false, 1)
assert({ name: "" }, OBJECT({}), false, 1)
assert({}, OBJECT({ name: OR(STRING(), UNDEFINED()) }), true)
assert({ age: 12 }, OBJECT({ name: STRING() }), false, 2)
assert({ notes: ["cool"] }, OBJECT({ notes: LIST() }), true)
assert(
	{ notes: ["cool"], setting: {} },
	OBJECT({ notes: LIST(), settings: OBJECT({}) }),
	false,
	2
)
assert(
	{ notes: ["cool"], settings: {} },
	OBJECT({
		notes: LIST(),
		settings: OBJECT({ is_admin: BOOLEAN() })
	}),
	false,
	1
)
console.log("Validators: object    ✅")
// endregion

// region null
assert(null, NULL(), true)
assert(undefined, NULL(), false, 1)
assert(0, NULL(), false, 1)
assert("", NULL(), false, 1)
assert([], NULL(), false, 1)
console.log("Validators: null      ✅")
// endregion

// region undefined
assert(undefined, UNDEFINED(), true)
assert(null, UNDEFINED(), false, 1)
assert(0, UNDEFINED(), false, 1)
assert("", UNDEFINED(), false, 1)
assert([], UNDEFINED(), false, 1)
console.log("Validators: undefined ✅")
// endregion

// region or
assert(0, OR(STRING(), NUMBER()), true)
assert(0, OR(NULL(), UNDEFINED()), false, 1)
assert(0, OR(STRING("hi", "bye"), NUMBER(1, 2)), false, 1)
console.log("Validators: or        ✅")
// endregion