import Validator from "../classes/Validator"
import {
	BOOLEAN,
	CLASS,
	LIST,
	NULL,
	NUMBER,
	OBJECT,
	OR,
	STRING,
	UNDEFINED,
	validate
} from "../index"

const _expect = (data: any, validator: Validator<any>) => ({
	toBe: (count: number) => {
		const { errors } = validate(data, validator)
		if (errors.length > 0 && errors.length !== count) {
			console.log(errors)
		}

		expect(errors.length).toBe(count)
	}
})

describe("String Validator works when", () => {
	test("basic string", () => {
		_expect(123, STRING()).toBe(1)
		_expect("123", STRING()).toBe(0)
		_expect([123], STRING()).toBe(1)
		_expect({ name: "John" }, STRING()).toBe(1)
		_expect(true, STRING()).toBe(1)
		_expect(null, STRING()).toBe(1)
		_expect(undefined, STRING()).toBe(1)
	})

	test("regex", () => {
		_expect("123", STRING(/^123$/)).toBe(0)
		_expect("", STRING(/^123$/)).toBe(1)
		_expect(123, STRING(/^123$/)).toBe(1)
	})

	test("list of strings", () => {
		_expect("abc", STRING("abc", "def")).toBe(0)
		_expect("abc", STRING("ab", "cd")).toBe(1)
	})
})

describe("Number Validator works when", () => {
	test("basic number", () => {
		_expect(123, NUMBER()).toBe(0)
		_expect("123", NUMBER()).toBe(1)
		_expect([123], NUMBER()).toBe(1)
		_expect({ name: "John" }, NUMBER()).toBe(1)
		_expect(true, NUMBER()).toBe(1)
		_expect(null, NUMBER()).toBe(1)
		_expect(undefined, NUMBER()).toBe(1)
	})

	test("list of numbers", () => {
		_expect(123, NUMBER(123, 234)).toBe(0)
		_expect(123, NUMBER(456, 789)).toBe(1)
	})
})

describe("Boolean Validator works when", () => {
	test("basic boolean", () => {
		_expect(123, BOOLEAN()).toBe(1)
		_expect("123", BOOLEAN()).toBe(1)
		_expect([123], BOOLEAN()).toBe(1)
		_expect({ name: "John" }, BOOLEAN()).toBe(1)
		_expect(true, BOOLEAN()).toBe(0)
		_expect(null, BOOLEAN()).toBe(1)
		_expect(undefined, BOOLEAN()).toBe(1)
	})

	test("true", () => {
		_expect(true, BOOLEAN(true)).toBe(0)
		_expect(false, BOOLEAN(true)).toBe(1)
	})

	test("false", () => {
		_expect(true, BOOLEAN(false)).toBe(1)
		_expect(false, BOOLEAN(false)).toBe(0)
	})
})

describe("List Validator works when", () => {
	test("basic list validator", () => {
		_expect(123, LIST()).toBe(1)
		_expect("123", LIST()).toBe(1)
		_expect([123], LIST()).toBe(0)
		_expect({ name: "John" }, LIST()).toBe(1)
		_expect(true, LIST()).toBe(1)
		_expect(null, LIST()).toBe(1)
		_expect(undefined, LIST()).toBe(1)
	})

	test("list of validators", () => {
		_expect([], LIST(STRING())).toBe(0)
		_expect([], LIST(NUMBER())).toBe(0)
		_expect([123], LIST(STRING())).toBe(1)
		_expect([123], LIST(STRING(), NUMBER())).toBe(0)
		_expect([123], LIST(NUMBER(234))).toBe(1)
		_expect([123], LIST(OR(NUMBER(234), NUMBER(123))))
		_expect(["123"], LIST(STRING(), NUMBER(123))).toBe(0)
		_expect(["123"], LIST(STRING("234"))).toBe(1)
		_expect([{ name: "" }], LIST(OBJECT({ name: STRING() }))).toBe(0)
		_expect(
			[{ name: "" }, { age: 1 }],
			LIST(OBJECT({ name: STRING() }))
		).toBe(2)
	})
})

describe("Object Validator works when", () => {
	test("basic object", () => {
		_expect(123, OBJECT()).toBe(1)
		_expect("123", OBJECT()).toBe(1)
		_expect([123], OBJECT()).toBe(1)
		_expect({ name: "John" }, OBJECT()).toBe(0)
		_expect(true, OBJECT()).toBe(1)
		_expect(null, OBJECT()).toBe(1)
		_expect(undefined, OBJECT()).toBe(1)
	})

	test("too many properties", () => {
		_expect({ name: "John" }, OBJECT({})).toBe(1)
		_expect({ name: "John", age: 1 }, OBJECT({ name: STRING() })).toBe(1)
	})

	test("too few properties", () => {
		_expect({}, OBJECT({ name: STRING() })).toBe(1)
		_expect(
			{ name: "John" },
			OBJECT({ name: STRING(), age: NUMBER() })
		).toBe(1)
		_expect({}, OBJECT({ name: STRING(), age: NUMBER() })).toBe(2)
	})

	test("different properties", () => {
		_expect({ name: "John" }, OBJECT({ name: STRING() })).toBe(0)
		_expect({ name: "John" }, OBJECT({ age: NUMBER() })).toBe(2)
		_expect(
			{ name: "John", age: "1" },
			OBJECT({ name: STRING(), age: NUMBER() })
		).toBe(1)
		_expect(
			{ names: ["John"], settings: {} },
			OBJECT({ names: LIST(STRING()), settings: LIST() })
		).toBe(1)
		_expect(
			{ names: ["John"], settings: {} },
			OBJECT({ names: LIST(STRING()), settings: OBJECT({}) })
		).toBe(0)
		_expect(
			{ names: ["John"], settings: {} },
			OBJECT({ names: LIST(STRING()), settings: OBJECT() })
		).toBe(0)
	})
})

describe("Null Validator", () => {
	test("basic null", () => {
		_expect(123, NULL()).toBe(1)
		_expect("123", NULL()).toBe(1)
		_expect([123], NULL()).toBe(1)
		_expect({ name: "John" }, NULL()).toBe(1)
		_expect(true, NULL()).toBe(1)
		_expect(null, NULL()).toBe(0)
		_expect(undefined, NULL()).toBe(1)
	})
})

describe("Undefined Validator", () => {
	test("basic undefined", () => {
		_expect(123, UNDEFINED()).toBe(1)
		_expect("123", UNDEFINED()).toBe(1)
		_expect([123], UNDEFINED()).toBe(1)
		_expect({ name: "John" }, UNDEFINED()).toBe(1)
		_expect(true, UNDEFINED()).toBe(1)
		_expect(null, UNDEFINED()).toBe(1)
		_expect(undefined, UNDEFINED()).toBe(0)
	})
})

describe("Or Validator", () => {
	test("basic or", () => {
		_expect(0, OR(STRING(), NUMBER())).toBe(0)
		_expect(0, OR(NULL(), UNDEFINED())).toBe(1)
		_expect(0, OR(STRING("hi", "bye"), NUMBER(1, 2))).toBe(1)
	})
})

describe("Class Validator", () => {
	const X = class {}
	const Y = class {}
	test("basic class", () => {
		_expect(new X(), CLASS(X)).toBe(0)
		_expect(new X(), CLASS(Y)).toBe(1)
		_expect("hi", CLASS(String)).toBe(1)
		_expect(new String(""), CLASS(String)).toBe(0)
	})
})
