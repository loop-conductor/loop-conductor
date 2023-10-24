import { getIdGenerator, getMaxObjectManager } from "./Globals";
import { stringifyTime } from "./Time";
import { Task } from "./Types";

type Observer = (tasks: Task[]) => void;

export class TaskManager {
  private scheduledTasks: Record<number, Task> = {};
  private observers: Observer[] = [];

  public observe(observer: Observer): () => void {
    const i = this.observers.length;
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.splice(i, 1);
    };
  }

  public reset() {
    this.scheduledTasks = {};
    this.notifyObservers();
  }

  public createTask(args: Omit<Task, "id">): Task {
    const id = getIdGenerator().id();
    const task: Task = {
      id,
      ...args,
    };
    return task;
  }

  public scheduleTask(args: { task: Task }): void {
    const { task } = args;
    const objectRegistry = getMaxObjectManager();
    const messageObj = objectRegistry.newObject("message");
    const bPatcherObj = objectRegistry.newObject(
      "bpatcher",
      "TaskRunner.maxpat"
    );
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
    this.notifyObservers();
  }

  public runTask(id: number) {
    const task = this.scheduledTasks[id];
    if (task) {
      task.callback();
      delete this.scheduledTasks[id];
      this.notifyObservers();
    }
  }

  private notifyObservers() {
    const task = Object.keys(this.scheduledTasks).map(
      (key) => this.scheduledTasks[key as any]
    );
    this.observers.forEach((observer) => observer(task));
  }
}
