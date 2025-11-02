/** @import FFLEActor from "../actor.mjs" */

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export default class FFLENpcSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["ffle", "sheet", "actor", "npc"],
    position: {
      width: 600,
      height: 900,
    },
    form: {
      submitOnChange: true,
    },
    actions: {
      rollAttack: this.#onAttackRoll,
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
    npc: {
      template: "systems/ffle-sheet/templates/sheets/actor/tabs/npc.hbs",
      templates: [
        "systems/ffle-sheet/templates/sheets/actor/shared/defenses/defenses.hbs",
        "systems/ffle-sheet/templates/sheets/actor/shared/defenses/base-defenses.hbs",
        "systems/ffle-sheet/templates/sheets/actor/shared/attack.hbs",
      ],
      scrollable: [""],
    },
    npcSettings: {
      template:
        "systems/ffle-sheet/templates/sheets/actor/tabs/npc-settings.hbs",
      templates: [
        "systems/ffle-sheet/templates/sheets/actor/npc/traits.hbs",
        "systems/ffle-sheet/templates/sheets/actor/npc/armor.hbs",
      ],
    },
    notes: {
      template: "systems/ffle-sheet/templates/sheets/actor/tabs/notes.hbs",
      scrollable: [""],
    },
  };

  /** @inheritdoc */
  static TABS = {
    primary: {
      tabs: [{ id: "npc" }, { id: "npcSettings" }, { id: "notes" }],
      labelPrefix: "FFLE.tab",
      initial: "npc",
    },
  };

  /**
   * Handle attack rolls
   * @this {FFLENpcSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #onAttackRoll(event, target) {
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
   * @this {FFLENpcSheet}
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
    const validBonusLevels = new Array((system.maxBonusLevel ?? 0) + 1)
      .fill(0)
      .map((_, index) => index);

    foundry.utils.mergeObject(context, {
      actor,
      system,
      enrichedNotes,
      validBonusLevels,
    });

    return context;
  }

  /** @override */
  async _preparePartContext(partId, context) {
    context.tab = context.tabs[partId];

    return context;
  }
}
