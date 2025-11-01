/** @import FFLEActor from "../actor.mjs" */

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export default class FFLEPcSheet extends HandlebarsApplicationMixin(
  ActorSheetV2,
) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["ffle", "sheet", "actor", "pc"],
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
      template: "systems/ffle-sheet/templates/sheets/actor/tabs/pc.hbs",
      templates: [
        "systems/ffle-sheet/templates/sheets/actor/shared/defenses/defenses.hbs",
        "systems/ffle-sheet/templates/sheets/actor/shared/defenses/base-defenses.hbs",
        "systems/ffle-sheet/templates/sheets/actor/shared/defenses/armor.hbs",
        "systems/ffle-sheet/templates/sheets/actor/shared/attack.hbs",
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
   * @this {FFLEPcSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollAttack(event, target) {
    event.preventDefault();
    const targetDefense = target.dataset.defense;

    const targets = [...game.user.targets];

    if (targets.length < 1) {
      const { notifications } = foundry.ui;
      const msg = game.i18n.localize("FFLE.error.noTargetSelected");
      notifications.warn(msg);
      return;
    }

    await this.actor.rollAttack(targets, targetDefense);
  }

  /**
   * Handle image editing
   * @this {FFLEPcSheet}
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
    const context = {
      FFLE: CONFIG.FFLE,
      /** @type {Record<string, foundry.applications.types.ApplicationTab>} */
      tabs: this._prepareTabs("primary"),
      isEditable: this.isEditable,
    };

    const { TextEditor } = foundry.applications.ux;
    const enrichedNotes = await TextEditor.enrichHTML(this.actor.system.notes, {
      secrets: this.actor.isOwner,
      rollData: this.actor.getRollData(),
      relativeTo: this.actor,
    });

    /** @type {FFLEActor} */
    const actor = this.actor;
    const system = actor.system;

    foundry.utils.mergeObject(context, {
      actor,
      system,
      enrichedNotes,
    });

    return context;
  }

  /** @override */
  async _preparePartContext(partId, context) {
    context.tab = context.tabs[partId];

    return context;
  }
}
