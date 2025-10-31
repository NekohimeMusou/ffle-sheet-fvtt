import FFLEBaseActorData from "../base/base-actor.mjs";

const fields = foundry.data.fields;

/**
 * Data model for PCs.
 * @extends FFLEBaseActorData
 */
export default class PCData extends FFLEBaseActorData {
  /** @override */
  static defineSchema() {
    return {
      ...super.defineSchema(),
      initiative: new fields.NumberField({ integer: true, initial: 0 }),
    };
  }

  /** @override */
  prepareBaseData() {
    super.prepareBaseData();

    this.defense.phys += this.armorBonus.phys;
    this.defense.mag += this.armorBonus.mag;
  }
}
