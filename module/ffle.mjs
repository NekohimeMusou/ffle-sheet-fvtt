import { FFLE } from "./config/config.mjs";
import { ACTORMODELS } from "./data-models/actor-data-models.mjs";
import FFLEActor from "./documents/actor/actor.mjs";
import FFLEActorSheet from "./documents/actor/actor-sheet.mjs";

const { Hooks } = foundry.helpers;
const { Actors } = foundry.documents.collections;

Hooks.once("init", () => {
  console.log("FFLE | Initializing FFLE Sheet game system");

  // Add config constants
  CONFIG.FFLE = FFLE;

  game.ffle = { FFLEActor };

  registerDataModels();
  registerDocumentClasses();
  registerDocumentSheets();
});

function registerDataModels() {
  CONFIG.Actor.dataModels = ACTORMODELS;
}

function registerDocumentClasses() {
  CONFIG.Actor.documentClass = FFLEActor;
}

function registerDocumentSheets() {
  Actors.unregisterSheet("core", foundry.applications.sheets.ActorSheetV2);
  Actors.registerSheet(FFLE.PACKAGE_ID, FFLEActorSheet, {
    label: "FFLE.charSheet",
    types: ["pc", "npc"],
    makeDefault: true,
  });
}
