import { Task, stringifyTime } from "@loop-conductor/common";

type Observer = (scheduledTasks: Task[], runnedTask?: Task) => void;

export class TaskManager {
  private scheduledTasks: Record<number, Task> = {};
  private observers: Observer[] = [];

  private parentPatcher: Patcher;
  private maxObjects: Maxobj[];

  constructor(parentPatcher: Patcher) {
    this.parentPatcher = parentPatcher;
    this.maxObjects = [];
  }

  public newMaxObject(name: string, ...args: unknown[]): Maxobj {
    const obj = this.parentPatcher.newdefault(500, 500, name, ...args);
    this.maxObjects.push(obj);
    return obj;
  }

  /**
   * Observe the list of scheduled tasks.
   *
   * A new event is emitted each time the list of scheduled tasks is updated.
   *
   * @param observer A callback taking as first argument the list of scheduled tasks
   * @returns A cleanup function to remove the observer
   */
  public observe(observer: Observer): () => void {
    const i = this.observers.length;
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.splice(i, 1);
    };
  }

  public clearScheduledTasks() {
    // Remove all the max object
    for (let i = 0; i < this.maxObjects.length; i++) {
      this.parentPatcher.remove(this.maxObjects[i]);
    }
    this.maxObjects = [];

    // Then clean any scheduled task
    this.scheduledTasks = {};
    this.notifyObservers();
  }

  /**
   * Schedule a new set of task for execution.
   * Note that all pending tasks will be cleared before adding the new ones.
   *
   * @param tasks The list of tasks to schedule
   */
  public scheduleTask(tasks: Task[]): void {
    // Clear any previous scheduled task before adding new ones
    this.clearScheduledTasks();

    // Add the new tasks
    tasks.forEach((task) => {
      const messageObj = this.newMaxObject("message");
      const bPatcherObj = this.newMaxObject("bpatcher", "TaskRunner.maxpat");
      patcher.connect(messageObj, 0, bPatcherObj, 0);
      messageObj.message(
        "set",
        JSON.stringify({
          taskId: task.id,
          taskTimepoint: stringifyTime(task.timepoint),
        })
      );
      messageObj.message("bang");

      this.scheduledTasks[task.id] = task;
    });
    this.notifyObservers();
  }

  public runTask(id: number) {
    const task = this.scheduledTasks[id];
    if (task) {
      task.callback();
      delete this.scheduledTasks[id];
      this.notifyObservers(task);
    }
  }

  private notifyObservers(runnedTask?: Task) {
    const task = Object.keys(this.scheduledTasks).map(
      (key) => this.scheduledTasks[key as any]
    );
    this.observers.forEach((observer) => observer(task, runnedTask));
  }
}
