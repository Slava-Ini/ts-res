import { ErrOverload, ErrType, OkOverload, Result } from "./types";

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

  return callback(this.error);
}

// TODO: docs
export const Ok: OkOverload = <T>(data?: T): Result<T | undefined, never> => {
  return { ok: true, data, throw: throwErr, else: elseDo };
};

// TODO: docs
export const Err: ErrOverload = <E extends ErrType>(
  error?: E
): Result<never, E | undefined> => {
  return { ok: false, error, throw: throwErr, else: elseDo };
};

// TODO: also add example with extended Error
