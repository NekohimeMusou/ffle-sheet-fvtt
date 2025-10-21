/** @import { DefenseType } from "../../config/config.mjs" */
const { Roll } = foundry.dice;
const { ChatMessage } = foundry.documents;
export default class FFLEActor extends foundry.documents.Actor {
  /**
   * @param {DefenseType} defenseType
   */
  async rollAttack(defenseType) {
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
