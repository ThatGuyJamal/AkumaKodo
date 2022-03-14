import { AkumaKodoBotInterface } from "../../interfaces/Client.ts";
import { AkumaKodoTask } from "../../interfaces/Task.ts";
import { AkumaKodoLogger } from "../../../internal/logger.ts";
import { Milliseconds } from "../utils/Helpers.ts";
import { AkumaKodoCollection } from "../utils/Collection.ts";
import { AkumaKodoBot } from "../AkumaKodo.ts";

/**
 * Allows you to create a new task for the bot.
 * @param bot The bot to create the task for.
 * @param task The task to be created.
 * @param callback Optional callback ran after the task is created. You can use this to do something after the task is created.
 */
export function createAkumaKodoTask(bot: AkumaKodoBotInterface, task: AkumaKodoTask, callback?: () => any) {
  bot.taskCollection.set(task.name, task);
  if (callback) {
    callback();
  }
}

/**
 * Starts all registered tasks.
 */
export function initializeTask(bot: AkumaKodoBotInterface) {
  for (const task of AkumaKodoBot.taskCollection.values()) {
    bot.runningTasks.initialTimeouts.push(
      setTimeout(async () => {
        try {
          await task.execute();
          AkumaKodoLogger("info", "initializeTask", `Task ${task.name} executed`);
        } catch (error) {
          AkumaKodoLogger("error", "initializeTask", `Task ${task.name} failed to execute.\n ${error}`);
        }

        bot.runningTasks.initialTimeouts.push(
          setInterval(async () => {
            if (!AkumaKodoBot.fullyReady) return;
            try {
              await task.execute();
              AkumaKodoLogger("info", "initializeTask", `Task ${task.name} executed`);
            } catch (error) {
              AkumaKodoLogger("error", "initializeTask", `Task ${task.name} failed to execute.\n ${error}`);
            }
          }, task.interval),
        );
      }, task.interval - (Date.now() % task.interval) ?? undefined),
    );
  }
}

/**
 * Destroys all task intervals in the bot.
 * @param bot   The bot to destroy the intervals for.
 * @param callback Optional callback ran after the intervals are destroyed. You can use this to do something after the intervals are destroyed.
 */
export function destroyTasks(bot: AkumaKodoBotInterface, callback?: () => any) {
  for (const task of bot.runningTasks.initialTimeouts) {
    clearTimeout(task);
  }
  for (const task of bot.runningTasks.intervals) clearInterval(task);

  bot.taskCollection = new AkumaKodoCollection<string, AkumaKodoTask>();
  bot.runningTasks = { initialTimeouts: [], intervals: [] };

  if (callback) {
    callback();
  }
}
