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
  };
}

/**
 * Base data model for actors. Individual actor types (PC, NPC) should extend this.
 * @abstract
 * @extends foundry.abstract.TypeDataModel
 */
export default class FFLEBaseActorData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return generateSchema();
  }

  get halfLevel() {
    return Math.max(1, Math.floor(this.level / 2));
  }

  get quarterLevel() {
    return Math.max(1, Math.floor(this.level / 4));
  }
}
