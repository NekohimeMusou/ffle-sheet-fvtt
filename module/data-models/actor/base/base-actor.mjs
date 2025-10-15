/** @import { Roll } from "@client/dice/_module.mjs" */
import generateResourceSchema from "./resource.mjs";
import { FFLE } from "../../../config/config.mjs";

const fields = foundry.data.fields;

function generateSchema() {
  return {
    notes: new fields.HTMLField(),

    hp: new fields.SchemaField(generateResourceSchema()),
    mp: new fields.SchemaField(generateResourceSchema()),

    defense: new fields.SchemaField({
      phys: new fields.NumberField({ integer: true, initial: 10 }),
      mag: new fields.NumberField({ integer: true, initial: 10 }),
      skill: new fields.NumberField({ integer: true, initial: 10 }),
    }),

    // DEBUG: Temporary fields for testing dice rolls
    damageRoll: new fields.StringField({
      validate: (input) => Roll.validate(input),
      validationError: "Not a valid dice roll string.",
      initial: "1d8",
    }),
    attackMod: new fields.NumberField({ integer: true, initial: 0 }),
    targetDefense: new fields.StringField({
      choices: FFLE.defenseTypes,
      initial: "phys",
    }),
  };
}

/**
 * Base data model for actors. Individual actor types (PC, NPC) should extend this.
 * @abstract
 */
export default class FFLEBaseActorData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return generateSchema();
  }
}
