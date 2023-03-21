import { ErrType, Result } from "./types";

// --- Note ---
// `throw` is a reserved keyword
function throwErr<T, E extends ErrType>(
  this: Result<T, E>,
  message?: string
): T {
  if (!this.ok) {
    if (typeof this.error === "string" || typeof this.error === "undefined") {
      const defaultMessage =
        "There was an error! No specific error message was provided.";

      throw new Error(message || this.error || defaultMessage);
    }

    if (message) {
      this.error.message = message;
    }

    throw this.error;
  }

  return this.data;
}

// --- Note ---
// `else` is a reserved keyword
function elseDo<T, E extends ErrType>(
  this: Result<T, E>,
  callback: (error: E) => T
): T {
  if (this.ok) {
    return this.data;
  }

  // TODO:
  // - Tackle the problem of callback return type not being enforced when using `void` | `undefined` as `T`
  // - In the same situation `or` works well
  return callback(this.error);
}

function or<T, E extends ErrType>(this: Result<T, E>, orValue: T): T {
  if (this.ok) {
    return this.data;
  }

  return orValue;
}

function and<T, E extends ErrType>(
  this: Result<T, E>,
  callback: (result: T) => void
): void {
  if (this.ok) {
    callback(this.data);
  }
}

/**
 * @method Ok - Returns a value with a type `T` of `Result<T, E>` signifying success of an operation. If the `T` type is `void` or `undefined` can be used without a value.
 * @returns `{ok: true, data: T}` result object.
 * @example
 * ```ts
 * function toNumber(str: string): Result<number, Error> {
 *   const parseResult = Number(str);
 *
 *   if (isNaN(parseResult)) {
 *     return Err(new Error(`Couldn't convert ${str} to number`));
 *   }
 *
 *   return Ok(parseResult);
 * }
 *
 * function testFileRead(path: string): Result<void, void> {
 *   const data = fs.readFile(path);
 *
 *   if (!data.length) {
 *     return Err();
 *   }
 *
 *   return Ok();
 * }
 * ```
 * */
export function Ok<T>(): Result<T | undefined, never>;
export function Ok<T>(data: T): Result<T, never>;
export function Ok<T>(data?: T): Result<T | undefined, never> {
  return { ok: true, data, throw: throwErr, else: elseDo, or, and };
}

/**
 * @method Err - Returns a value with a type `E` of `Result<T, E>` signifying fail of an operation. If the `E` type is `void` or `undefined` can be used without a value.
 *
 * *Note:* `E` type is constrained by `undefined | void | string | Error`, custom error type that extends native `Error` also satisfies type boundaries
 * @returns `{ok: fale, error: E}` result object.
 * @example
 * ```ts
 * function toNumber(str: string): Result<number, Error> {
 *   const parseResult = Number(str);
 *
 *   if (isNaN(parseResult)) {
 *     return Err(new Error(`Couldn't convert ${str} to number`));
 *   }
 *
 *   return Ok(parseResult);
 * }
 *
 * function testFileRead(path: string): Result<void, void> {
 *   const data = fs.readFile(path);
 *
 *   if (!data.length) {
 *     return Err();
 *   }
 *
 *   return Ok();
 * }
 * ```
 * */
export function Err<E extends ErrType>(): Result<never, E | undefined>;
export function Err<E extends ErrType>(error: E): Result<never, E>;
export function Err<E extends ErrType>(
  error?: E
): Result<never, E | undefined> {
  return { ok: false, error, throw: throwErr, else: elseDo, or, and };
}
