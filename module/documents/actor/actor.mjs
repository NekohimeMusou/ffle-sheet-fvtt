/** @import { DefenseType } from "../../config/config.mjs" */
export default class FFLEActor extends foundry.documents.Actor {
  /**
   * @param {DefenseType} _defense
   */
  async rollAttack(_defense) {
    foundry.ui.notifications.info("Attack event handler triggered.");
  }
}
