import Validator from "../classes/Validator"
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
} from "../index"

const expect_ = (data: any, validator: Validator<any>) => ({
	toBe: (errors: number) => {
		expect(validate(data, validator).errors.length).toBe(errors)
	}
})

describe("String Validator works when", () => {
	test("basic string", () => {
		expect_(123, STRING()).toBe(1)
		expect_("123", STRING()).toBe(0)
		expect_([123], STRING()).toBe(1)
		expect_({ name: "John" }, STRING()).toBe(1)
		expect_(true, STRING()).toBe(1)
		expect_(null, STRING()).toBe(1)
		expect_(undefined, STRING()).toBe(1)
	})

	test("regex", () => {
		expect_("123", STRING(/^123$/)).toBe(0)
		expect_("", STRING(/^123$/)).toBe(1)
		expect_(123, STRING(/^123$/)).toBe(1)
	})

	test("list of strings", () => {
		expect_("abc", STRING("abc", "def")).toBe(0)
		expect_("abc", STRING("ab", "cd")).toBe(1)
	})
})

describe("Number Validator works when", () => {
	test("basic number", () => {
		expect_(123, NUMBER()).toBe(0)
		expect_("123", NUMBER()).toBe(1)
		expect_([123], NUMBER()).toBe(1)
		expect_({ name: "John" }, NUMBER()).toBe(1)
		expect_(true, NUMBER()).toBe(1)
		expect_(null, NUMBER()).toBe(1)
		expect_(undefined, NUMBER()).toBe(1)
	})

	test("list of numbers", () => {
		expect_(123, NUMBER(123, 234)).toBe(0)
		expect_(123, NUMBER(456, 789)).toBe(1)
	})
})

describe("Boolean Validator works when", () => {
	test("basic boolean", () => {
		expect_(123, BOOLEAN()).toBe(1)
		expect_("123", BOOLEAN()).toBe(1)
		expect_([123], BOOLEAN()).toBe(1)
		expect_({ name: "John" }, BOOLEAN()).toBe(1)
		expect_(true, BOOLEAN()).toBe(0)
		expect_(null, BOOLEAN()).toBe(1)
		expect_(undefined, BOOLEAN()).toBe(1)
	})

	test("true", () => {
		expect_(true, BOOLEAN(true)).toBe(0)
		expect_(false, BOOLEAN(true)).toBe(1)
	})

	test("false", () => {
		expect_(true, BOOLEAN(false)).toBe(1)
		expect_(false, BOOLEAN(false)).toBe(0)
	})
})

describe("List Validator works when", () => {
	test("basic list validator", () => {
		expect_(123, LIST()).toBe(1)
		expect_("123", LIST()).toBe(1)
		expect_([123], LIST()).toBe(0)
		expect_({ name: "John" }, LIST()).toBe(1)
		expect_(true, LIST()).toBe(1)
		expect_(null, LIST()).toBe(1)
		expect_(undefined, LIST()).toBe(1)
	})

	test("list of validators", () => {
		expect_([], LIST(STRING())).toBe(0)
		expect_([], LIST(NUMBER())).toBe(0)
		expect_([123], LIST(STRING())).toBe(1)
		expect_([123], LIST(STRING(), NUMBER())).toBe(0)
		expect_([123], LIST(NUMBER(234))).toBe(1)
		expect_([123], LIST(OR(NUMBER(234), NUMBER(123))))
		expect_(["123"], LIST(STRING(), NUMBER(123))).toBe(0)
		expect_(["123"], LIST(STRING("234"))).toBe(1)
		expect_([{ name: "" }], LIST(OBJECT({ name: STRING() }))).toBe(0)
		expect_(
			[{ name: "" }, { age: 1 }],
			LIST(OBJECT({ name: STRING() }))
		).toBe(2)
	})
})

describe("Object Validator works when", () => {
	test("basic object", () => {
		expect_(123, OBJECT()).toBe(1)
		expect_("123", OBJECT()).toBe(1)
		expect_([123], OBJECT()).toBe(1)
		expect_({ name: "John" }, OBJECT()).toBe(0)
		expect_(true, OBJECT()).toBe(1)
		expect_(null, OBJECT()).toBe(1)
		expect_(undefined, OBJECT()).toBe(1)
	})

	test("too many properties", () => {
		expect_({ name: "John" }, OBJECT({})).toBe(1)
		expect_({ name: "John", age: 1 }, OBJECT({ name: STRING() })).toBe(1)
	})

	test("too few properties", () => {
		expect_({}, OBJECT({ name: STRING() })).toBe(1)
		expect_(
			{ name: "John" },
			OBJECT({ name: STRING(), age: NUMBER() })
		).toBe(1)
		expect_({}, OBJECT({ name: STRING(), age: NUMBER() })).toBe(2)
	})

	test("different properties", () => {
		expect_({ name: "John" }, OBJECT({ name: STRING() })).toBe(0)
		expect_({ name: "John" }, OBJECT({ age: NUMBER() })).toBe(2)
		expect_(
			{ name: "John", age: "1" },
			OBJECT({ name: STRING(), age: NUMBER() })
		).toBe(1)
		expect_(
			{ names: ["John"], settings: {} },
			OBJECT({ names: LIST(STRING()), settings: LIST() })
		).toBe(1)
		expect_(
			{ names: ["John"], settings: {} },
			OBJECT({ names: LIST(STRING()), settings: OBJECT({}) })
		).toBe(0)
		expect_(
			{ names: ["John"], settings: {} },
			OBJECT({ names: LIST(STRING()), settings: OBJECT() })
		).toBe(0)
	})
})

describe("Null Validator", () => {
	test("basic null", () => {
		expect_(123, NULL()).toBe(1)
		expect_("123", NULL()).toBe(1)
		expect_([123], NULL()).toBe(1)
		expect_({ name: "John" }, NULL()).toBe(1)
		expect_(true, NULL()).toBe(1)
		expect_(null, NULL()).toBe(0)
		expect_(undefined, NULL()).toBe(1)
	})
})

describe("Undefined Validator", () => {
	test("basic undefined", () => {
		expect_(123, UNDEFINED()).toBe(1)
		expect_("123", UNDEFINED()).toBe(1)
		expect_([123], UNDEFINED()).toBe(1)
		expect_({ name: "John" }, UNDEFINED()).toBe(1)
		expect_(true, UNDEFINED()).toBe(1)
		expect_(null, UNDEFINED()).toBe(1)
		expect_(undefined, UNDEFINED()).toBe(0)
	})
})

describe("Or Validator", () => {
	test("basic or", () => {
		expect_(0, OR(STRING(), NUMBER())).toBe(0)
		expect_(0, OR(NULL(), UNDEFINED())).toBe(1)
		expect_(0, OR(STRING("hi", "bye"), NUMBER(1, 2))).toBe(1)
	})
})
