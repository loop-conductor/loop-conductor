import { ClipManager } from "./ClipManager";
import { ConductorManager } from "./ConductorManager";
import { Live } from "./Live";
import { MaxObjectManager } from "./MaxObjectManager";
import { PadsManager } from "./PadsManager";
import { TaskManager } from "./TaskManager";
import { IdGenerator } from "./Utils";

const globals: Record<string, Global> = {};
const globalName = "main";

interface GlobalAttributes {
  idGenerator: IdGenerator;
  maxObjectManager: MaxObjectManager;
  clipManager: ClipManager;
  live: Live;
  taskManager: TaskManager;
  padsManager: PadsManager;
  conductorManager: ConductorManager | null;
}

export function setGlobal<T extends keyof GlobalAttributes>(
  name: T,
  value: GlobalAttributes[T]
): void {
  if (!globals[globalName]) {
    globals[globalName] = new Global(globalName);
  }
  const global = globals[globalName];
  (<any>global)[name] = value;
}

export function getGlobal<T extends keyof GlobalAttributes>(
  name: T
): GlobalAttributes[T] {
  if (!globals[globalName]) {
    globals[globalName] = new Global(globalName);
  }
  const global = globals[globalName];
  return (<any>global)[name];
}

export function hasGlobal<T extends keyof GlobalAttributes>(name: T): boolean {
  if (!globals[globalName]) {
    globals[globalName] = new Global(globalName);
  }
  const global = globals[globalName];
  return !!(<any>global)[name];
}

export function getMaxObjectManager(): MaxObjectManager {
  return getGlobal("maxObjectManager");
}

export function getClipManager(): ClipManager {
  return getGlobal("clipManager");
}

export function getLive(): Live {
  return getGlobal("live");
}

export function getTaskManager(): TaskManager {
  return getGlobal("taskManager");
}

export function getPadsManager(): PadsManager {
  return getGlobal("padsManager");
}

export function getConductorManager(): ConductorManager | null {
  return getGlobal("conductorManager");
}

export function getIdGenerator(): IdGenerator {
  return getGlobal("idGenerator");
}
