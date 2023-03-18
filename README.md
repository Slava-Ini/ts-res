# ts-result

TypeScript Result for Error Handling

`Result` and `Ok()`/`Err()` methods can be used for simple and concise error handling in TypeScript.

## Example Usage

- Use `throw()` to unwrap the value or throw an error

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
- Or handle `Result` manually

```ts
const parseResult = toNumber("456");

if (!parseResult.ok) {
  throw parseResult.error;
}

const muNumber: number = parseResult.data; // Returns 456
```
- Use `or()` to provide a back-up value

```ts
function getStatusCode(): Result<number, string> {
  const statusCode = Math.floor(Math.random() * 100);

  if (statusCode > 200 && statusCode < 300) {
    return Ok(statusCode);
  }

  return Err("Invalide status code");
}

function obtainStatus(): number {
  return getStatusCode().or(0); // Returns `statusCode` between 201 and 299 or 0
}
```


- Use `else()` to provide a back-up value based on error

```ts
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

function obtainStatus(): number {
  return getStatusCode().else((error) => {
    if (error === "Low") {
      return 0;
    }

    return 1000;
  }); // Returns `statusCode` between 201 and 299 or (0 or 1000 depending on error text)
}
```

