import { ValidationError } from "@loop-conductor/common";

type LogObserver = (type: "info" | "error", log: unknown) => void;

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

export class LogManager {
  private observers: LogObserver[] = [];

  private currentInfo: any = {};

  public observe(observer: LogObserver): () => void {
    const i = this.observers.length;
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.splice(i, 1);
    };
  }

  public startInfoGroup(info: object): void {
    this.currentInfo = {
      ...info,
      Events: [],
    };
    logInfo(info);
    this.observers.forEach((observer) => observer("info", this.currentInfo));
  }
  public logInfo(info: object) {
    if (this.currentInfo) {
      logInfo(info);
      this.currentInfo.Events.push(info);
      this.observers.forEach((observer) => observer("info", this.currentInfo));
    }
  }
  public logError(err: ValidationError) {
    logError(err);
    this.currentInfo = undefined;
    this.observers.forEach((observer) => observer("error", err));
  }
}
