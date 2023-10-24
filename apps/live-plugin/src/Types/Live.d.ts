declare function post(...args: unknown[]): void;

declare function outlet(index: number, value: unknown): void;

declare let autowatch: number;

declare var patcher: Patcher;

declare var inlets: number;
declare var outlets: number;

/**
 * LiveAPI object
 */
declare class LiveAPI {
  constructor(callback: Function | null, path: string);

  set(property: string, value: unknown): void;
  get<T = unknown>(property: string): T;
  call(method: string, ...args: unknown[]): void;
  getcount(property: string): number;
}

/**
 * LiveAPI object
 */
declare class Maxobj {
  message(name: string, ...args: unknown[]): void;
  setattr(name: string, value: unknown): void;
}

/**
 * Patcher object
 */
declare class Patcher {
  constructor(left: number, top: number, bottom: number, right: number);
  constructor();
  newobject(name: string, ...args: unknown[]): Maxobj;
  newdefault(x: number, y: number, name: string, ...args: unknown[]): Maxobj;
  connect(obj1: Maxobj, outlet: number, obj2: Maxobj, inlet: number): void;
  remove(obj: Maxobj): void;
}

/**
 * File object
 */
declare class File {
  constructor(
    path: string,
    access: "read" | "write" | "readwrite",
    typelist: string
  );
  readstring(count: number): string;
}

/**
 * Dict object
 */
declare class Dict {
  constructor(name: string);
  getkeys(): string[] | string | null;
  get(key: string): string;
  set(key: string, value: string): string;
  clear(): void;
}

/**
 * Global
 */
declare class Global {
  constructor(name: string);

  sendnamed(receive_name: string, property_name: string): void;
}
