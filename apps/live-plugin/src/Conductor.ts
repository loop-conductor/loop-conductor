import { ConductorModel } from "./Lib/ConductorModel";

import { IdGenerator, isValidationError } from "@loop-conductor/common";
import {
  getConductorManager,
  getGlobal,
  getLive,
  getLogManager,
  getMidiManager,
  getPadsManager,
  getTaskManager,
  setGlobal,
} from "./Lib/Globals";
import { Live } from "./Lib/Live";
import { LogManager, logError, logInfo } from "./Lib/LogManager";
import { MidiManager } from "./Lib/MidiManager";
import { PadsManager } from "./Lib/PadsManager";
import { TaskManager } from "./Lib/TaskManager";

enum Outlets {
  errorLog = 0,
  infoLog = 1,
  padConfig = 2,
  cacheConductor = 3,
  restoreConductorFromCache = 4,
}

outlets = 5;

function init() {
  logInfo("Initializing");
  setGlobal("logManager", new LogManager());
  setGlobal("idGenerator", new IdGenerator());
  setGlobal("live", new Live());
  setGlobal("taskManager", new TaskManager(patcher));
  setGlobal("padsManager", new PadsManager());
  setGlobal("midiManager", new MidiManager());

  getLogManager().observe((type, log) => {
    if (type === "error") {
      outlet(Outlets.errorLog, JSON.stringify(log));
    } else {
      outlet(Outlets.infoLog, JSON.stringify(log));
    }
  });

  getPadsManager().observe((config) => {
    outlet(Outlets.padConfig, JSON.stringify(config));
  });

  getMidiManager().observe(({ conductor }) => {
    let conductorModel: ConductorModel | null = null;

    logInfo("1");
    try {
      conductorModel = new ConductorModel(conductor);
      getLogManager().startInfoGroup({
        Info: "Conductor updated",
        Conductor: conductor.name,
      });

      // Send the conductor to the conductor outlet
      // This will send it to a sub patcher that will persist it
      // even if live is shut down
      // This conductor will later be restored by this same patcher
      // when this js file sends a bang on outlet
      outlet(Outlets.cacheConductor, JSON.stringify(conductor));
    } catch (conductorOrError) {
      if (isValidationError(conductorOrError)) {
        getLogManager().logError(conductorOrError);
        return;
      }
    }
    setGlobal("conductorManager", conductorModel);
    // Make sure to reset the task manager after the conductor has been set to null
    // so it will trigger an event with the right conductor value
    getTaskManager().clearScheduledTasks();
  });

  // Once everything is setup ask the sub patcher to restore the conductor
  outlet(Outlets.restoreConductorFromCache, "bang");
}

function reset(): void {
  logInfo("Resetting");
  getConductorManager()?.deleteManagedClips();
  getTaskManager().clearScheduledTasks();

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
    conductorModel = ConductorModel.parse(json);
    getLogManager().startInfoGroup({
      Info: "Conductor restored",
      Conductor: conductorModel?.conductor?.name,
    });
  } catch (conductorOrError) {
    if (isValidationError(conductorOrError)) {
      getLogManager().logError(conductorOrError);
      return;
    }
  }

  setGlobal("conductorManager", conductorModel);
  // Make sure to reset the task manager after the conductor has been set to null
  // so it will trigger an event with the right conductor value
  getTaskManager().clearScheduledTasks();
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
