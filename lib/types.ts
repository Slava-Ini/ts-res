type ThrowType = <T, E extends ErrType>(
  this: Result<T, E>,
  message?: string
) => T;
type ElseType = <T, E extends ErrType>(
  this: Result<T, E>,
  callback: (error: E) => T
) => T;
type OrType = <T, E extends ErrType>(this: Result<T, E>, orValue: T) => T;

type ThrowMethod = {
  /**
   * @method `throw` returns unwrapped result data or throws an error. If the error message wasn't provided and the type of error is `void` or `undefined` will use the default error message.
   * @param {string | undefined} message - optional message parameter to be used as an error message (if an `Error` was provided for `E` type it's message will be overwritten by this custom message)
   * @throws provided error or a common `Error` with the default message
   * @returns result data with the type `T`, provided in `Result<T, E>`
   * @example
   * ```ts
   * function toNumber(str: string): Result<number, string> {
   *   const parseResult = Number(str);
   *
   *   if (isNaN(parseResult)) {
   *     return Err("Couldn't parse a string");
   *   }
   *
   *   return Ok(parseResult);
   * }
   *
   * function getNumber(): number {
   *   return toNumber("123").throw(); // Returns 123
   * }
   *
   * function getNumber(): number {
   *   return toNumber("abc").throw(); // Throws Error("Couldn't parse a string")
   * }
   *
   * ```
   * */
  throw: ThrowType;
};

type OrMethod = {
  /**
   * @method `or` returns unwrapped result data or returns a back-up value
   * @param {T} orValue - back-up value to be used in case there was an error. Value type should match `T` type specified in `Result<T, E>`
   * @returns result data with the type `T`, provided in `Result<T, E>`
   * @example
   * ```ts
   * function getStatusCode(): Result<number, string> {
   *   const statusCode = Math.floor(Math.random() * 100);
   *
   *   if (statusCode > 200 && statusCode < 300) {
   *      return Ok(statusCode);
   *   }
   *
   *   return Err("Wrong status code");
   * }
   *
   * function obtainStatus(): number {
   *  return getStatusCode().or(0);
   * }
   *
   * ```
   * */
  or: OrType;
};

type ElseMethod = {
  /**
   * @method `else` returns unwrapped result data or executes a callback which has an access to an error.
   * @param {(error: E) => T} callback - callback which will be executed if result ok field will is false. Callback is provided with `error` argument with the error type provided as `E` in `Result<T, E>`, should return value of the type `T`
   * @returns result data with the type `T`, provided in `Result<T, E>`
   * @example
   * ```ts
   * function getStatusCode(): Result<number, string> {
   *   const statusCode = Math.floor(Math.random() * 100);
   *
   *   if (statusCode > 200 && statusCode < 300) {
   *      return Ok(statusCode);
   *   }
   *
   *   if (statusCode < 200) {
   *      return Err("Low");
   *   }
   *
   *   return Err("High");
   * }
   *
   * function obtainStatus(): number {
   *  return getStatusCode().else((error) => {
   *    if (error === "Low") {
   *      return 0;
   *    }
   *
   *    return 1000;
   *  });
   * }
   *
   * ```
   * */
  else: ElseType;
};

type ResultMethods = ThrowMethod & ElseMethod & OrMethod;

export type ErrType = string | Error | undefined | void;

// --- Note ---
// `E extends ErrType` is not used here for better readability
/**
 * @type `Result<T, E>` - is used to signify that the operation may fail. `T` is generic return type of the value, it can be any type, `E` is an error type it's constrained by `string | Error | undefined | void`.
 *
 * Value, returned from a function with a type `Result<T, E>` will contain an `ok` boolean field signifying success or fail, if `ok` is `true`, then `Result<T, E>` will also contain `data` field with type `T`, otherwise it will contain an `error` field with type `E`.
 *
 * To be able to return a correct value from a function with return type `Result<T, E>` use methods `Ok(T)`, `Err(E)`.
 *
 * *Additionally* `Result<T, E>` contains a number of helper methods such as `throw()`, `or()`, `else()` to make handling result as simple as possible
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
 * toNumber("123"); // -> {ok: true, data: 123}
 * toNumber("abc"); // -> {ok: false, error: Error("Couldn't convert abc to number")}
 * ```
 * */
export type Result<T, E extends string | Error | void | undefined> =
  | ({ ok: true; data: T } & ResultMethods)
  | ({ ok: false; error: E } & ResultMethods);

export type OkOverload = {
  <T>(): Result<T | undefined, never>;
  <T>(data: T): Result<T, never>;
};

export type ErrOverload = {
  <E extends ErrType>(): Result<never, E | undefined>;
  <E extends ErrType>(error: E): Result<never, E>;
};
