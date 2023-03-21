# ts-res

Tiny library to improve error handling in TS using Rust-inspired types.

## Contents

- [Installation](#installation)
- [Result Type](#result-type)
- [Helper Methods](#helper-methods)
- [Examples](#examples)

## Installation

- Using npm - `npm install ts-result`
- Using yarn - `yarn add ts-result`
- Using pnpm - `pnpm add ts-result`

## Result Type

Result type is convenient to use as a return type of a method that may fail.

In `Result<T, E>`:

- `T` specifies success result type, which can be any type
- `E` specifies error type, which is constrained by `Error | string | void | undefined`.

`Err()` and `Ok()` are used as a return type enforcers.

```ts
function mayFail(isFailed: boolean): Result<number, Error> {
  if (isFailed) {
    return Err(new Error("Function failed"));
  }

  return Ok(123);
}
```

As a result we get an object which will either be `{ok: true, data: T}` or `{ok: false, error: E}`

_Note:_ `Ok()` and `Err()` can be used with no values if `T`/`E` were specified as `void` or `undefined`

```ts
function getEmptyResult(isFailed: boolean): Result<void, void> {
  if (isFailed) {
    return Err();
  }

  return Ok();
}
```

## Helper Methods

`Result<T, E>` can be handled manually:

```ts
const result = mayFail(true);

if (!result.ok) {
  throw result.error;
}

console.log(result.data);
```

However it's much easier to use helper methods to quickly handle the result:

- `throw(message?: string)` - throws an error (with an optional custom error message) or returns an unwrapped result
- `or(value: T)` - returns an unwrapped result or a back-up value
- `else(callback: (error: E) => T)` - returns an unwrapped result or executes callback that returns back-up value which can be based on provided error
- `and(callback: (result: T) => void)` - handles a result in a callback while ignoring an error, doesn't return anything

```ts
// -- throw()
mayFail(true).throw(); // returns 123
mayFail(false).throw(); // throws an Error with default message
mayFail(false).throw("My Message"); // throws an Error with "My Message"

// -- or()
mayFail(true).or(100); // returns 123
mayFail(false).or(100); // returns 100

// -- else()
mayFail(true).else((error) => 200); // returns 123
mayFail(false).else((error) => 200); // returns 200 (error can be used for some extra logic)

// -- and()
mayFail(true).and((result) => { 
  console.log(result);
}); // logs 123
mayFail(false).and((result) => {
  console.log(result);
}); // doesn't do anything
```

## Examples

More elaborate examples:

- Use `throw()` to unwrap the value after parsing a number

```typescript
function toNumber(str: string): Result<number, string> {
  const result = Number(str);

  if (isNaN(result)) {
    return Err("Couldn't parse a string");
  }

  return Ok(result);
}

const myNumber: number = toNumber("Hello").throw(); // Throws an Error
const myNumber: number = toNumber("123").throw(); // Returns 123
```

- Use `or()` to provide a back-up value while obtaining status code

```ts
function getStatusCode(statusCode: number): Result<number, string> {
  if (statusCode > 200 && statusCode < 300) {
    return Ok(statusCode);
  }

  return Err("Invalide status code");
}

function obtainStatus(): number {
  return getStatusCode(response.statusCode).or(404); // Returns `statusCode` between 201 and 299 or 404
}
```

- Use `else()` and `CustomError` to provide a back-up value based on error type

```ts
enum ErrorType {
  A,
  B,
  C,
}

class CustomError extends Error {
  private errorType: ErrorType;

  constructor(type: ErrorType) {
    super();
    this.errorType = type;
  }

  get type(): ErrorType {
    return this.errorType;
  }
}

function myFunction(): Result<void, CustomError> {
  //...
}

myFunction().else((error) => {
  switch (error.type) {
    case ErrorType.A:
      return "a";
    case ErrorType.B:
      return "b";
    case ErrorType.C:
      return "c";
    default:
      break;
  }
});
```

- Use `and()` to handle a result of writing data to `localStorage` and ignore the error
```ts
function readLocalStorage(key: string): Result<string, void> {
  const data = localStorage.getItem(key);

  if (!data) {
    return Err();
  }

  return Ok(data);
}

readLocalStorage.and((data) => {
  const parsedData = JSON.parse(data);
  console.log(parsedData);
})
```
