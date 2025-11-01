/** @import { Token } from "@client/canvas/placeables/_module.mjs" */
/** @import { Roll } from "@client/dice/_module.mjs" */
/** @import { DefenseType, RollType } from "../../config/config.mjs" */
const { Roll } = foundry.dice;
const { ChatMessage } = foundry.documents;
const { renderTemplate } = foundry.applications.handlebars;
const { mergeObject } = foundry.utils;

/**
 * The data context for an individual target, associated with one HBS template instance.
 * @typedef {Object} TargetOutputData
 * @prop {string} targetName
 * @prop {number} defenseValue
 * @prop {boolean} attackSuccess
 * @prop {number} margin
 * @prop {number} eed
 * @prop {Roll} [damageRoll]
 * @prop {string} [damageRender]
 */

/**
 * @extends {foundry.documents.Actor}
 */
export default class FFLEActor extends foundry.documents.Actor {
  /**
   * Chat template to use for attack rolls
   * @readonly
   */
  static ATTACK_ROLL_TEMPLATE =
    "systems/ffle-sheet/templates/chat/attack/attack-card.hbs";

  /**
   * Process all targeted tokens.
   * @param {Token[]} targets
   * @param {DefenseType} targetDefense
   * @param {number} attackTotal
   * @param {boolean} critSuccess
   * @returns {Promise<TargetOutputData[]>}
   */
  async #processAllTargets(targets, targetDefense, attackTotal, critSuccess) {
    return await Promise.all(
      targets.map(async (target) => {
        const data = await this.#processTarget(
          target,
          targetDefense,
          attackTotal,
          critSuccess,
        );
        if (data.damageRoll) {
          data.damageRender = await data.damageRoll.render();
        }
        return data;
      }),
    );
  }

  /**
   * Get the data from a target and generate the context for its respective Handlebars part
   * @param {Token} target
   * @param {DefenseType} targetDefense
   * @param {number} attackTotal
   * @param {boolean} critSuccess
   * @returns {Promise<TargetOutputData>}
   */
  async #processTarget(target, targetDefense, attackTotal, critSuccess) {
    const actor = target.actor;
    /**
     * @type {number}
     * @default 10
     */
    const defenseValue = actor.system.defense[targetDefense] ?? 10;

    const margin = attackTotal - defenseValue;

    const attackSuccess = margin >= 0;

    /**
     * @type {number}
     * @default 1
     */
    const eedFactor = this.system.eedFactor ?? 1;

    const eed = Math.floor(margin / eedFactor);

    const targetData = {
      targetName: target.name,
      defenseValue,
      attackSuccess,
      margin,
      eed,
    };

    if (attackSuccess) {
      const { damageFormula } = this.system;

      const damageRoll = new Roll(
        damageFormula,
        this.getRollData(),
      );

      if (critSuccess) {
        damageRoll.alter(2, 0);
      }

      // Remember to evaluate roll
      mergeObject(targetData, { damageRoll });
    }

    return targetData;
  }

  /**
   * Make an attack roll. Display a chat card with the d20 roll, then for each target,
   * compare the attack roll to their AC and append a partial showing whether the attack hit
   * and, if so, how many EED are generated.
   * @param {Token[]} targets
   * @param {DefenseType} targetDefense
   */
  async rollAttack(targets, targetDefense) {
    foundry.ui.notifications.info(
      `Attack event handler triggered: ${targetDefense}`,
    );

    const {
      attackMod,
      critSuccessThreshold,
      critFailThreshold,
      boons,
      rollType,
    } = this.system;

    let diceString = "1d20";

    switch (rollType) {
      case "advantage":
        diceString = "2d20kh";
        break;
      case "disadvantage":
        diceString += "2d20kl";
        break;
    }

    const boonString =
      boons === 0 ? "" : `${boons < 0 ? "-" : "+"}${boons}d6k1`;
    const formula = `${diceString}+${attackMod}${boonString}`;
    const attackRoll = await new Roll(formula, this.getRollData()).evaluate();

    const total = attackRoll.total;

    const naturalRoll = attackRoll.dice[0].total ?? attackRoll.total;

    const critSuccess = naturalRoll >= critSuccessThreshold;

    const critFail = !critSuccess && naturalRoll <= critFailThreshold;

    /** @type {TargetOutputData[]} */
    const targetData = await this.#processAllTargets(
      targets,
      targetDefense,
      total,
    );

    const damageRolls = targetData
      .filter((tgt) => tgt.damageRoll)
      .map((tgt) => tgt.damageRoll);

    const rolls = [attackRoll, ...damageRolls];

    const context = {
      targetDefense,
      attackRoll: await attackRoll.render(),
      targetData,
      critSuccess,
      critFail,
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
      rolls,
    };

    await ChatMessage.create(chatData);
  }
}
