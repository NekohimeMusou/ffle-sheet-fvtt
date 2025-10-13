/** @import { Actor } from "@client/config.mjs" */
import { FFLE } from "./config/config.mjs";
import { ACTORMODELS } from "./data-models/actor-data-models.mjs";
import FFLEActor from "./documents/actor/actor.mjs";
import FFLEActorSheet from "./documents/actor/actor-sheet.mjs";

const { Hooks } = foundry.helpers;
const { DocumentSheetConfig } = foundry.applications.apps;

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
  DocumentSheetConfig.registerSheet(Actor, FFLE.PACKAGE_ID, FFLEActorSheet, {
    label: "FFLE.charSheet",
    types: ["pc", "npc"],
    makeDefault: true,
  });
}
