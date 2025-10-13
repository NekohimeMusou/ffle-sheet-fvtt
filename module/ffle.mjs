import { FFLE } from "./config/config.mjs";
import { ACTORMODELS } from "./data-models/actor-data-models.mjs";
import FFLEActor from "./documents/actor/actor.mjs";

Hooks.on("ready", () => {
  console.log("FFLE | Initializing FFLE Sheet game system");

  // Add config constants
  CONFIG.FFLE = FFLE;

  game.ffle = { FFLEActor };

  registerDataModels();
  registerDocumentClasses();
});

function registerDataModels() {
  CONFIG.Actor.dataModels = ACTORMODELS;
}

function registerDocumentClasses() {
  CONFIG.Actor.documentClass = FFLEActor;
}
