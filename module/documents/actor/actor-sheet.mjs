import { FFLE } from "../../config/config.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export default class FFLEActorSheet extends HandlebarsApplicationMixin(
  ActorSheetV2,
) {
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
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    debug: {
      template: "systems/ffle-sheet/templates/sheets/actor/tabs/debug.hbs",
    },
    notes: {
      template: "systems/ffle-sheet/templates/sheets/actor/tabs/notes.hbs",
    },
  };

  async _prepareContext(_options) {
    return {
      FFLE,
      system: this.actor.system,
    };
  }
}
