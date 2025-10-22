/** @import { Token } from "@client/canvas/placeables/_module.mjs" */
/** @import { DefenseType } from "../../config/config.mjs" */
const { Roll } = foundry.dice;
const { ChatMessage } = foundry.documents;

/**
 * The data context for an individual target, associated with one HBS template instance.
 * @typedef {Object} TargetOutputData
 * @prop {string} name
 * @prop {DefenseType} defenseType
 */

export default class FFLEActor extends foundry.documents.Actor {
  // Get list of targets
  // Make d20 roll
  // Compare result to each target's defense

  /**
   * @param {Set<Token>} targets
   * @param {DefenseType} defenseType
   */
  async rollAttack(targets, defenseType) {
    foundry.ui.notifications.info(
      `Attack event handler triggered: ${defenseType}`,
    );
    const defense = 10;

    const { attackMod, attackEED } = this.system;
    const formula = `1d20+${attackMod}`;
    const attackRoll = await new Roll(formula, this.getRollData()).roll();

    const total = attackRoll.total;

    const threshold = total - defense;
    const success = threshold >= 0;
    const EED = Math.floor(threshold / attackEED);

    const msg = success ? `Hit! EED: ${EED}` : "Missed!";

    const content = `<h1>${msg}</h1>${await attackRoll.render()}`;

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
    };

    await ChatMessage.create(chatData);
  }
}
