import { Result, Ok, Err } from "../lib";

describe("Result<number, Error>", () => {
  function toNumber(str: string): Result<number, Error> {
    const parseResult = Number(str);

    if (isNaN(parseResult)) {
      return Err(new Error(`Couldn't convert ${str} to number`));
    }

    return Ok(parseResult);
  }

  test("manual", () => {
    const result = toNumber("123");
    const falsyResult = toNumber("abc");

    expect(result.ok).toBeTruthy();

    if (result.ok) {
      expect(result.data).toBe(123);
    }

    expect(falsyResult.ok).toBeFalsy();

    if (!result.ok) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe("Couldn't convert abc to number");
    }
  });

  test("throw", () => {
    const result = toNumber("123").throw();
    const falsyResultCallback = () => {
      toNumber("abc").throw();
    };
    const falsyResultCallbackCustomMessage = () => {
      toNumber("abc").throw("My Custom Message");
    };

    expect(result).toBe(123);
    expect(falsyResultCallback).toThrowError(
      new Error("Couldn't convert abc to number")
    );
    expect(falsyResultCallbackCustomMessage).toThrowError(
      new Error("My Custom Message")
    );
  });

  test("or", () => {
    const result = toNumber("123").or(100);
    const falsyResult = toNumber("abc").or(100);

    expect(result).toBe(123);
    expect(falsyResult).toBe(100);
  });

  test("else", () => {
    const result = toNumber("123").else((_) => 100);
    const falsyResult = toNumber("abc").else((error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Couldn't convert abc to number");

      return 100;
    });

    expect(result).toBe(123);
    expect(falsyResult).toBe(100);
  });

  test("and", () => {
    const mockFn = jest.fn();

    toNumber("123").and((result) => {
      expect(result).toBe(123);
    });
    toNumber("abc").and((_) => {
      mockFn();
    });

    expect(mockFn).not.toHaveBeenCalled();
  });
});

describe("Result<void, void>", () => {
  function getEmptyResult(flag: boolean): Result<void, void> {
    if (!flag) {
      return Err();
    }

    return Ok();
  }

  test("manual", () => {
    const result = getEmptyResult(true);
    const falsyResult = getEmptyResult(false);

    expect(result.ok).toBeTruthy();

    if (result.ok) {
      expect(result.data).toBe(undefined);
    }

    expect(falsyResult.ok).toBeFalsy();

    if (!result.ok) {
      expect(result.error).toBe(undefined);
    }
  });

  test("throw", () => {
    const result = getEmptyResult(true).throw();
    const falsyResultCallback = () => {
      getEmptyResult(false).throw();
    };
    const falsyResultCallbackCustomMessage = () => {
      getEmptyResult(false).throw("My Custom Message");
    };

    expect(result).toBe(undefined);
    expect(falsyResultCallback).toThrowError(
      new Error("There was an error! No specific error message was provided.")
    );
    expect(falsyResultCallbackCustomMessage).toThrowError(
      new Error("My Custom Message")
    );
  });

  test("or", () => {
    const result = getEmptyResult(true).or(undefined);
    const falsyResult = getEmptyResult(false).or(undefined);

    expect(result).toBe(undefined);
    expect(falsyResult).toBe(undefined);
  });

  test("else", () => {
    const result = getEmptyResult(true).else((_) => undefined);
    const falsyResult = getEmptyResult(false).else((_) => {
      return undefined;
    });

    expect(result).toBe(undefined);
    expect(falsyResult).toBe(undefined);
  });

  test("and", () => {
    const mockFn = jest.fn();

    getEmptyResult(true).and((result) => {
      expect(result).toBe(undefined);
    });
    getEmptyResult(false).and((_) => {
      mockFn();
    });

    expect(mockFn).not.toHaveBeenCalled();
  });
});

describe("Result<void, CustomError>", () => {
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

  function getCustomError(type: ErrorType): Result<void, CustomError> {
    return Err(new CustomError(type));
  }

  test("manual", () => {
    const result = getCustomError(ErrorType.A);

    expect(result.ok).toBeFalsy();

    if (!result.ok) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.type).toBe(ErrorType.A);
    }
  });

  test("throw", () => {
    const resultCallback = () => {
      getCustomError(ErrorType.B).throw();
    };
    const resultCallbackCustomMessage = () => {
      getCustomError(ErrorType.B).throw("My Custom Message");
    };

    expect(resultCallback).toThrowError(new CustomError(ErrorType.B));

    const resultError = new CustomError(ErrorType.B);
    resultError.message = "My Custom Message";

    expect(resultCallbackCustomMessage).toThrow(resultError);
  });

  test("or", () => {
    const result = getCustomError(ErrorType.C).or(undefined);

    expect(result).toBe(undefined);
  });

  test("else", () => {
    const result = getCustomError(ErrorType.C).else((_) => undefined);

    expect(result).toBe(undefined);
  });

  test("and", () => {
    const mockFn = jest.fn();

    getCustomError(ErrorType.A).and((result) => {
      expect(result).toBe(undefined);
    });
    getCustomError(ErrorType.A).and((_) => {
      mockFn();
    });

    expect(mockFn).not.toHaveBeenCalled();
  });
});
