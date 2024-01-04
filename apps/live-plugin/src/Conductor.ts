import { ConductorModel } from "./Lib/ConductorModel";

import { IdGenerator, isValidationError } from "@loop-conductor/common";
import {
  getConductorManager,
  getGlobal,
  getLive,
  getMidiManager,
  getPadsManager,
  getTaskManager,
  setGlobal,
} from "./Lib/Globals";
import { Live } from "./Lib/Live";
import { logError, logInfo } from "./Lib/Log";
import { MidiManager } from "./Lib/MidiManager";
import { PadsManager } from "./Lib/PadsManager";
import { TaskManager } from "./Lib/TaskManager";

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
  setGlobal("taskManager", new TaskManager(patcher));
  setGlobal("padsManager", new PadsManager());
  setGlobal("midiManager", new MidiManager());
  outlet(Outlets.readyBang, "bang");

  getPadsManager().observe((config) => {
    outlet(Outlets.padConfig, JSON.stringify(config));
  });

  getMidiManager().observe(({ conductor }) => {
    let conductorModel: ConductorModel | null = null;

    try {
      conductorModel = new ConductorModel(conductor);
    } catch (conductorOrError) {
      setGlobal("conductorManager", null);

      // Make sure to reset the task manager after the conductor has been set to null
      // so it will trigger an event with the right conductor value
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

    setGlobal("conductorManager", conductorModel);
    // Make sure to reset the task manager after the conductor has been set to null
    // so it will trigger an event with the right conductor value
    getTaskManager().reset();

    if (conductorModel) {
      logInfo("Conductor loaded");
      outlet(Outlets.conductor, JSON.stringify(conductor));
    }
  });
}

function reset(): void {
  logInfo("Resetting");
  getConductorManager()?.deleteManagedClips();
  getTaskManager().reset();

  getLive().unarmAllTracks();
}

/**
 * Max plugin entry point.
 *
 * Load a con
 * @param json
 * @returns
 */
function loadConductorFromString(json: string): void {
  let conductorModel: ConductorModel | null = null;

  try {
    logInfo("Loading conductor from string");
    conductorModel = ConductorModel.parse(json);
  } catch (conductorOrError) {
    setGlobal("conductorManager", null);

    // Make sure to reset the task manager after the conductor has been set to null
    // so it will trigger an event with the right conductor value
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

  setGlobal("conductorManager", conductorModel);
  // Make sure to reset the task manager after the conductor has been set to null
  // so it will trigger an event with the right conductor value
  getTaskManager().reset();

  if (conductorModel) {
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

function onSysexByteReceived(byte: number): void {
  const midiManager = getGlobal("midiManager");
  midiManager.onSysexByteReceived(byte);
}
