import { FFLE } from "../../config/config.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export default class FFLEActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["ffle-sheet", "sheet", "actor"],
    position: {
      width: 600,
      height: 800,
    },
  };

  static PARTS = {
    header: {
      template: "systems/ffle-sheet/templates/sheets/actor/header.hbs",
    },
    resources: {
      template: "systems/ffle-sheet/templates/sheets/actor/resources.hbs",
    },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    debug: {
      template: "systems/ffle-sheet/templates/sheets/actor/tabs/debug.hbs",
      scrollable: [""],
    },
    notes: {
      template: "systems/ffle-sheet/templates/sheets/actor/tabs/notes.hbs",
      scrollable: [""],
    },
  };

  static TABS = {
    primary: {
      tabs: [{ id: "debug" }, { id: "notes" }],
      labelPrefix: "FFLE.tab",
      initial: "debug",
    },
  };

  async _prepareContext(_options) {
    const context = {
      FFLE,
      system: this.actor.system,
      /** @type {Record<string, foundry.applications.types.ApplicationTab>} */
      tabs: this._prepareTabs("primary"),
    };

    return context;
  }

  async _preparePartContext(partId, context) {
    switch (partId) {
      case "debug":
        break;
      case "notes":
        break;
      default:
    }

    return context;
  }
}
