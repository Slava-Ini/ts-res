// TODO: remove import
import { Err, Ok } from "./helpers";

type ThrowType = <T, E extends ErrType>(
  this: Result<T, E>,
  message?: string
) => T;
type ElseType = <T, E extends ErrType>(
  this: Result<T, E>,
  callback: (error: E) => T
) => T;

type ThrowMethod = {
  /**
   * @method `throw` returns unwrapped result data or throws an error. If the error message wasn't provided and the type of error is `void` or `undefined` will use the default error message.
   * @param {string | undefined} message - optional message parameter to be used as an error message
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
   *    return 100;
   *  });
   * }
   *
   * ```
   * */
  else: ElseType;
};

export type ErrType = string | Error | undefined | void;

// --- Note ---
// `E extends ErrType` is not used here for better readability
// TODO: docs
export type Result<T, E extends string | Error | void | undefined> =
  | ({
      ok: true;
      data: T;
    } & ThrowMethod &
      ElseMethod)
  | ({ ok: false; error: E } & ThrowMethod & ElseMethod);

export type OkOverload = {
  <T>(): Result<T | undefined, never>;
  <T>(data: T): Result<T, never>;
};

export type ErrOverload = {
  <E extends ErrType>(): Result<never, E | undefined>;
  <E extends ErrType>(error: E): Result<never, E>;
};

function getStatusCode(): Result<number, string> {
  const statusCode = Math.floor(Math.random() * 100);

  if (statusCode > 200 && statusCode < 300) {
    return Ok(statusCode);
  }

  if (statusCode < 200) {
    return Err("Low");
  }

  return Err("High");
}
