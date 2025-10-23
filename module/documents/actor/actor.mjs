/** @import { Token } from "@client/canvas/placeables/_module.mjs" */
/** @import { DefenseType } from "../../config/config.mjs" */
const { Roll } = foundry.dice;
const { ChatMessage } = foundry.documents;
const { renderTemplate } = foundry.applications.handlebars;

/**
 * The data context for an individual target, associated with one HBS template instance.
 * @typedef {Object} TargetOutputData
 * @prop {string} targetName
 * @prop {number} defenseValue
 * @prop {boolean} attackSuccess
 * @prop {number} margin
 * @prop {number} eed
 */

export default class FFLEActor extends foundry.documents.Actor {
  /**
   * Chat template to use for attack rolls
   * @readonly
   */
  static ATTACK_ROLL_TEMPLATE =
    "systems/ffle-sheet/templates/chat/attack-card.hbs";

  // Get list of targets
  // Make d20 roll
  // Compare result to each target's defense

  /**
   * Get the data from a target and generate the context for its respective Handlebars part
   * @param {FFLEActor} target
   * @param {DefenseType} defenseType
   * @param {number} attackTotal
   * @returns {TargetOutputData}
   */
  async #processTarget(target, defenseType, attackTotal) {
    /**
     * @type {number}
     * @default 10
     */
    const defenseValue = target.system[defenseType] ?? 10;

    const margin = attackTotal - defenseValue;

    const attackSuccess = margin >= 0;

    /**
     * @type {number}
     * @default 1
     */
    const eedFactor = this.system.eedFactor ?? 1;

    const eed = Math.floor(margin / eedFactor);

    return {
      targetName: target.name,
      defenseValue,
      attackSuccess,
      margin,
      eed,
    };
  }

  /**
   * Make an attack roll. Display a chat card with the d20 roll, then for each target,
   * compare the attack roll to their AC and append a partial showing whether the attack hit
   * and, if so, how many EED are generated.
   * @param {Token[]} targets
   * @param {DefenseType} defenseType
   */
  async rollAttack(targets, defenseType) {
    foundry.ui.notifications.info(
      `Attack event handler triggered: ${defenseType}`,
    );

    const { attackMod } = this.system;
    const formula = `1d20+${attackMod}`;
    const attackRoll = await new Roll(formula, this.getRollData()).roll();

    const total = attackRoll.total;

    /** @type {TargetOutputData[]} */
    const targetData = await Promise.all(
      targets.map(async (target) => {
        this.#processTarget(target, defenseType, total);
      }),
    );

    const context = {
      defenseType,
      attackRoll: await attackRoll.render(),
      targetData,
    };

    const content = await renderTemplate(
      FFLEActor.ATTACK_ROLL_TEMPLATE,
      context,
    );

    const speaker = ChatMessage.getSpeaker({
      scene: game.scenes.current,
      actor: this,
      token: this.token,
    });

    const chatData = {
      author: game.user.id,
      content,
      style: CONST.CHAT_MESSAGE_STYLES.EMOTE,
      speaker,
      rolls: [attackRoll],
    };

    await ChatMessage.create(chatData);
  }
}
