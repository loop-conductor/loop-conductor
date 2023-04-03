import { getLive } from "./Globals";

interface Clip {
  trackIndex: number;
  sceneIndex: number;
}

export class MaxObjectManager {
  private parentPatcher: Patcher;
  private maxObjects: Maxobj[];

  constructor(parentPatcher: Patcher) {
    this.parentPatcher = parentPatcher;
    this.maxObjects = [];
  }

  public newObject(name: string, ...args: unknown[]): Maxobj {
    const obj = this.parentPatcher.newdefault(500, 500, name, ...args);
    this.maxObjects.push(obj);
    return obj;
  }

  public reset(): void {
    const live = getLive();
    for (let i = 0; i < this.maxObjects.length; i++) {
      this.parentPatcher.remove(this.maxObjects[i]);
    }

    this.maxObjects = [];
  }
}
