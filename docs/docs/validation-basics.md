# Validation Basics

## `validate` function

The `validate` is the main function of this package.
It provides the ability to validate data according to the schema it is given.

::: tip Parameter types

| Number | Type        | Description                                                                   |
| ------ | ----------- | ----------------------------------------------------------------------------- |
| `1`    | `any`       | The data we are validating                                                    |
| `2`    | `Validator` | A specific schema to compare the data to (more about this later)              |
| `3`    | `string?`   | The name of the root object when logs display errors. Defaults to `*` as root |

:::

::: tip Return type

| Property  | Type                 | Description                     |
| --------- | -------------------- | ------------------------------- |
| `success` | `boolean`            | If the validation was a success |
| `errors`  | `iValidationError[]` | The list of validation errors   |
| `data`    | `T`                  | The data                        |

:::

::: details TypeScript Source Code

```ts
type iValidationResult<T> =
	| {
			success: true
			errors: iValidationError[]
			data: T
	  }
	| {
			success: false
			errors: iValidationError[]
			data: undefined
	  }

const validate = <T>(
	data: any,
	schema: Validator<T>,
	name: string = "*"
): iValidationResult<T> => {
	/* ... */
}
```

:::

## `iValidationError` type

This is the typescript interface for a validation error.

Do take notice of the `location` property in the information below.
The `name` you provide to the `validate()` function will determine what the `*` is replaced with.

::: tip Information

| Property   | Type     | Description                                                           |
| ---------- | -------- | --------------------------------------------------------------------- |
| `location` | `string` | Where in the object the error occured e.g. `* > settings > wallpaper` |
| `message`  | `string` | A brief overview of the error                                         |
| `expected` | `string` | The expected type of value                                            |
| `value`    | `any`    | The value provided                                                    |

:::

::: details TypeScript Source Code

```ts
interface iValidationError {
	location: string
	message: string
	expected: string
	value: any
}
```

:::
