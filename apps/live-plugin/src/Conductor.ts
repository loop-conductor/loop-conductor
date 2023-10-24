import { ClipManager } from "./Lib/ClipManager";
import { ConductorManager } from "./Lib/ConductorManager";

import {
  getClipManager,
  getConductorManager,
  getLive,
  getMaxObjectManager,
  getPadsManager,
  getTaskManager,
  setGlobal,
} from "./Lib/Globals";
import { Live } from "./Lib/Live";
import { logError, logInfo } from "./Lib/Log";
import { MaxObjectManager } from "./Lib/MaxObjectManager";
import { PadsManager } from "./Lib/PadsManager";
import { TaskManager } from "./Lib/TaskManager";
import { IdGenerator, isValidationError } from "./Lib/Utils";

enum Outlets {
  conductor = 0,
  errors = 1,
  padConfig = 2,
  readyBang = 3,
}

outlets = 4;

function init() {
  logInfo("Initializing");
  setGlobal("idGenerator", new IdGenerator());
  setGlobal("live", new Live());
  setGlobal("taskManager", new TaskManager());
  setGlobal("padsManager", new PadsManager());
  setGlobal("maxObjectManager", new MaxObjectManager(patcher));
  setGlobal("clipManager", new ClipManager());
  outlet(Outlets.readyBang, "bang");

  getPadsManager().observe((config) => {
    outlet(Outlets.padConfig, JSON.stringify(config));
  });
}

function reset(): void {
  logInfo("Resetting");
  getMaxObjectManager().reset();
  getClipManager().reset();
  getTaskManager().reset();

  getLive().unarmAllTracks();
}

function loadFromString(json: string): void {
  const padsManager = getPadsManager();
  let conductorManager: ConductorManager | null = null;

  try {
    logInfo("Loading conductor from string");
    conductorManager = ConductorManager.parse(json);
  } catch (conductorOrError) {
    setGlobal("conductorManager", null);

    // Make sure to reset the task manager after the conductor has been set to null
    // so it will trigger an event with the right conductor value
    getMaxObjectManager().reset();
    getTaskManager().reset();

    if (isValidationError(conductorOrError)) {
      logError(
        "Failed to load conductor",
        conductorOrError.path,
        conductorOrError.err
      );
      outlet(
        Outlets.errors,
        JSON.stringify({
          error: conductorOrError.err,
          path: conductorOrError.path.join("."),
        })
      );
      return;
    }
  }

  setGlobal("conductorManager", conductorManager);
  // Make sure to reset the task manager after the conductor has been set to null
  // so it will trigger an event with the right conductor value
  getMaxObjectManager().reset();
  getTaskManager().reset();

  if (conductorManager) {
    logInfo("Conductor loaded");
    outlet(Outlets.conductor, json);
  }
}

/**
 * Trigger a sequence by pad id.
 * Note that pad ID are always 1 based.
 *
 * @param padId The pad id trigerred
 * @returns
 */
function triggerSequenceByPadId(padId: number): void {
  const conductorManager = getConductorManager();
  if (!conductorManager) {
    logError("Conductor not loaded");
    return;
  }
  conductorManager.triggerSequenceByPadId(padId);
}
