const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const { TextEditor } = foundry.applications.ux;
const { mergeObject } = foundry.utils;

export default class FFLEActorSheet extends HandlebarsApplicationMixin(
  ActorSheetV2,
) {
  static DEFAULT_OPTIONS = {
    classes: ["ffle-sheet", "sheet", "actor"],
    position: {
      width: 600,
      height: 800,
    },
    form: {
      submitOnChange: true,
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

  /** @override */
  async _prepareContext(_options) {
    const context = {};

    const FFLE = CONFIG.FFLE;
    const actor = this.actor;

    /** @type {Record<string, foundry.applications.types.ApplicationTab>} */
    const tabs = this._prepareTabs("primary");

    mergeObject(context, { FFLE, actor, system: actor.system, tabs });

    return context;
  }

  /** @override */
  async _preparePartContext(partId, context) {
    switch (partId) {
      case "debug":
        context.tab = context.tabs[partId];
        break;
      case "notes":
        {
          const enrichedNotes = await TextEditor.enrichHTML(
            this.actor.system.notes,
            {
              secrets: this.actor.isOwner,
              rollData: this.actor.getRollData(),
            },
          );

          context.enrichedNotes = enrichedNotes;
          context.tab = context.tabs[partId];
        }
        break;
    }

    return context;
  }
}
