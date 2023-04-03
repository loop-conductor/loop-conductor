function postToMaxConsole(a: unknown, b: unknown, c: unknown) {
  const params = [a, b, c, "\n"];

  post(
    params
      .filter((param) => param !== undefined)
      .map((param) => {
        if (typeof param === "string") {
          return param;
        } else if (typeof param === "number") {
          return param;
        } else if (typeof param === "boolean") {
          return param;
        } else {
          return JSON.stringify(param);
        }
      })
  );
}
export function logInfo(a: unknown, b?: unknown, c?: unknown) {
  postToMaxConsole(a, b, c);
}

export function logError(a: unknown, b?: unknown, c?: unknown) {
  postToMaxConsole(a, b, c);
}

export function logDebug(a: unknown, b?: unknown, c?: unknown) {
  postToMaxConsole(a, b, c);
}
