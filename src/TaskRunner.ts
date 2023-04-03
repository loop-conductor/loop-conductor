import { getTaskManager } from "./Lib/Globals";

function runTask(taskId: number) {
  const taskManager = getTaskManager();
  const normalizedTaskId =
    typeof taskId === "number" ? taskId : parseInt(taskId, 10);
  taskManager.runTask(normalizedTaskId);
}
