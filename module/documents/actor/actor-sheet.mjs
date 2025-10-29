const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export default class FFLEActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["ffle", "sheet", "actor"],
    position: {
      width: 600,
      height: 800,
    },
    form: {
      submitOnChange: true,
    },
    actions: {
      rollAttack: this.#rollAttack,
      editImage: this.#onEditImage,
    },
  };

  /** @inheritdoc */
  static PARTS = {
    header: {
      template: "systems/ffle-sheet/templates/sheets/actor/header.hbs",
    },
    resources: {
      template: "systems/ffle-sheet/templates/sheets/actor/resources.hbs",
    },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    pc: {
      template: "systems/ffle-sheet/templates/sheets/actor/tabs/debug.hbs",
      templates: [
        "systems/ffle-sheet/templates/sheets/actor/debug/defenses.hbs",
        "systems/ffle-sheet/templates/sheets/actor/debug/attack.hbs",
      ],
      scrollable: [""],
    },
    notes: {
      template: "systems/ffle-sheet/templates/sheets/actor/tabs/notes.hbs",
      scrollable: [""],
    },
  };

  /** @inheritdoc */
  static TABS = {
    primary: {
      tabs: [{ id: "pc" }, { id: "notes" }],
      labelPrefix: "FFLE.tab",
      initial: "pc",
    },
  };

  /**
   * Handle attack rolls
   * @this {FFLEActorSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollAttack(event, target) {
    event.preventDefault();
    const defenseType = target.dataset.defense;

    const targets = [...game.user.targets];

    if (targets.length < 1) {
      const { notifications } = foundry.ui;
      const msg = game.i18n.localize("FFLE.error.noTargetSelected");
      notifications.warn(msg);
      return;
    }

    await this.actor.rollAttack(targets, defenseType);
  }

  /**
   * Handle image editing
   * @this {FFLEActorSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #onEditImage(_event, target) {
    const field = target.dataset.field || "img";
    const current = foundry.utils.getProperty(this.document, field);

    const fp = new foundry.applications.apps.FilePicker({
      type: "image",
      current,
      callback: (path) => this.document.update({ [field]: path }),
    });

    fp.render(true);
  }

  /** @override */
  async _prepareContext(_options) {
    return {
      FFLE: CONFIG.FFLE,
      actor: this.actor,
      system: this.actor.system,
      /** @type {Record<string, foundry.applications.types.ApplicationTab>} */
      tabs: this._prepareTabs("primary"),
      isEditable: this.isEditable,
    };
  }

  /** @override */
  async _preparePartContext(partId, context) {
    switch (partId) {
      case "pc":
        context.tab = context.tabs[partId];
        break;
      case "notes":
        {
          const { TextEditor } = foundry.applications.ux;
          const enrichedNotes = await TextEditor.enrichHTML(
            this.actor.system.notes,
            {
              secrets: this.actor.isOwner,
              rollData: this.actor.getRollData(),
              relativeTo: this.actor,
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
