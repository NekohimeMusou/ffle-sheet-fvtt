import generateResourceSchema from "./resource.mjs";
import { FFLE } from "../../../config/config.mjs";

const fields = foundry.data.fields;
const { Roll } = foundry.dice;

/** Generate the base data schema for actors. */
function generateSchema() {
  return {
    level: new fields.NumberField({
      integer: true,
      positive: true,
      min: 1,
      max: 20,
      initial: 1,
    }),

    notes: new fields.HTMLField(),

    hp: new fields.SchemaField(generateResourceSchema()),
    mp: new fields.SchemaField(generateResourceSchema()),

    defense: new fields.SchemaField({
      phys: new fields.NumberField({ integer: true, initial: 10 }),
      mag: new fields.NumberField({ integer: true, initial: 10 }),
      skill: new fields.NumberField({ integer: true, initial: 10 }),
    }),

    // DEBUG: Temporary fields for testing dice rolls
    damageFormula: new fields.StringField({
      validate: (input) => Roll.validate(input),
      validationError: "Not a valid dice roll.",
      initial: "1d8",
    }),
    attackMod: new fields.NumberField({ integer: true, initial: 0 }),
    eedFactor: new fields.NumberField({ integer: true, initial: 3 }),
    targetDefense: new fields.StringField({
      choices: FFLE.defenseTypes,
      initial: "phys",
    }),
    noEED: new fields.BooleanField(),
    armorLevel: new fields.SchemaField({
      phys: new fields.StringField({
        choices: FFLE.levelBonusTiers,
        initial: "none",
      }),
      mag: new fields.StringField({
        choices: FFLE.levelBonusTiers,
        initial: "none",
      }),
    }),
    critSuccessThreshold: new fields.NumberField({
      integer: true,
      min: 1,
      max: 20,
      default: 20,
    }),
    critFailThreshold: new fields.NumberField({
      integer: true,
      min: 1,
      max: 20,
      default: 1,
    }),
    boons: new fields.NumberField({ integer: true, initial: 0 }),
    rollType: new fields.StringField({
      choices: FFLE.rollTypes,
      initial: "normal",
    }),
  };
}

/**
 * Base data model for actors. Individual actor types (PC, NPC) should extend this.
 * @extends foundry.abstract.TypeDataModel
 */
export default class FFLEBaseActorData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return generateSchema();
  }

  /**
   * Get the level bonus for a given tier (none, half, full)
   * @param {import("../../../config/config.mjs").LevelBonusTier} bonusTier
   * @returns {number}
   */
  getLevelBonus(bonusTier) {
    switch (bonusTier) {
      case "none":
        return 0;
      case "half":
        return this.halfLevel;
      case "full":
        return this.level;
    }
  }

  get halfLevel() {
    return Math.max(1, Math.floor(this.level / 2));
  }

  get quarterLevel() {
    return Math.max(1, Math.floor(this.level / 4));
  }

  /** @override */
  prepareBaseData() {
    // Get armor bonus
    this.armorBonus = {
      phys: this.getLevelBonus(this.armorLevel.phys),
      mag: this.getLevelBonus(this.armorLevel.mag),
    };
  }
}
