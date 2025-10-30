import { FFLE } from "./config/config.mjs";
import { ACTORMODELS } from "./data-models/actor-data-models.mjs";
import FFLEActor from "./documents/actor/actor.mjs";
import FFLEPcSheet from "./documents/actor/sheets/pc-sheet.mjs";
import FFLENpcSheet from "./documents/actor/sheets/npc-sheet.mjs";
import { templatePaths } from "./config/templates.mjs";
import { configureStatusEffects } from "./config/statuses.mjs";

const { Hooks } = foundry.helpers;
const { Actors } = foundry.documents.collections;
const { loadTemplates } = foundry.applications.handlebars;

Hooks.once("init", async () => {
  console.log("FFLE | Initializing FFLE Sheet game system");

  // Add config constants
  CONFIG.FFLE = FFLE;

  game.ffle = { FFLEActor };

  registerDataModels();
  registerDocumentClasses();
  registerDocumentSheets();
  configureStatusEffects();
  await preloadHandlebarsTemplates();
});

function registerDataModels() {
  CONFIG.Actor.dataModels = ACTORMODELS;
}

function registerDocumentClasses() {
  CONFIG.Actor.documentClass = FFLEActor;
}

function registerDocumentSheets() {
  Actors.unregisterSheet("core", foundry.applications.sheets.ActorSheetV2);
  Actors.registerSheet(CONFIG.FFLE.PACKAGE_ID, FFLEPcSheet, {
    label: "FFLE.sheet.pcSheet",
    types: ["pc"],
    makeDefault: true,
  });
  Actors.registerSheet(CONFIG.FFLE.PACKAGE_ID, FFLENpcSheet, {
    label: "FFLE.sheet.npcSheet",
    types: ["npc"],
    makeDefault: true,
  });
}

async function preloadHandlebarsTemplates() {
  await loadTemplates(templatePaths);
}
