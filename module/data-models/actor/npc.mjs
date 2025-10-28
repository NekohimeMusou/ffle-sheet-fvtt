/** @import FFLEActor from "../../documents/actor/actor.mjs" */
/** @import { NPCTier } from "../../config/config.mjs" */
import FFLEBaseActorData from "./base/base-actor.mjs";
import { FFLE } from "../../config/config.mjs";

const fields = foundry.data.fields;

// function generateConditionSchema() {
//   return {
//     battered: new fields.BooleanField(),
//     berserk: new fields.BooleanField(),
//     blind: new fields.BooleanField(),
//     bleeding: new fields.BooleanField(),
//     charm: new fields.BooleanField(),
//     confuse: new fields.BooleanField(),
//     entangled: new fields.BooleanField(),
//     knockdown: new fields.BooleanField(),
//     paralyzed: new fields.BooleanField(),
//     petrify: new fields.BooleanField(),
//     poison: new fields.BooleanField(),
//     prone: new fields.BooleanField(),
//     seal: new fields.BooleanField(),
//     slow: new fields.BooleanField(),
//     sleep: new fields.BooleanField(),
//     silence: new fields.BooleanField(),
//     stop: new fields.BooleanField(),
//     stun: new fields.BooleanField(),
//     zombie: new fields.BooleanField(),
//   };
// }

function generateSchema() {
  const traitModOptions = {
    integer: true,
    min: 0,
    max: 3,
    initial: 0,
  };

  return {
    apl: new fields.NumberField({
      integer: true,
      positive: true,
      min: 1,
      max: 20,
      initial: 1,
    }),

    npcTier: new fields.StringField({
      choices: FFLE.npcTiers,
      initial: "normal",
    }),

    traitMods: new fields.SchemaField({
      initiative: new fields.NumberField(traitModOptions),
      hpMp: new fields.NumberField(traitModOptions),
      attack: new fields.NumberField(traitModOptions),
      defense: new fields.NumberField(traitModOptions),
      skillDefense: new fields.NumberField(traitModOptions),
    }),

    extraMods: new fields.SchemaField({
      swapHpMp: new fields.BooleanField(),
      swapPdSd: new fields.BooleanField(),
    }),

    extraPoints: new fields.NumberField({ integer: true, min: 0, initial: 0 }),

    // Placeholder for calculated field
    statusPoints: new fields.NumberField({ integer: true, min: 0, initial: 0 }),

    // statusImmunities: new fields.SchemaField(generateConditionSchema()),
    // statusTouch: new fields.SchemaField(generateConditionSchema()),
  };
}

/**
 * Data model for NPCs.
 * @extends FFLEBaseActorData
 */
export default class NPCData extends FFLEBaseActorData {
  /**
   * @readonly
   */
  static TREASURE_DIE_SIZES = {
    normal: 6,
    notorious: 8,
    boss: 10,
    endBoss: 12,
  };

  /**
   * @readonly
   * @static
   */
  static ABILITY_MODIFIERS = {
    normal: 2,
    notorious: 3,
    boss: 4,
    endBoss: 5,
  };

  /** @override */
  static defineSchema() {
    return {
      ...super.defineSchema(),
      ...generateSchema(),
    };
  }

  /**
   * Prepare the base data for an NPC.
   *
   * Calculate trait points (extra + status + stats)
   *
   * Calculate damage formula (derived from APL + tier)
   * Maybe not yet (easier to just use the formula field for now)
   * @override
   */
  prepareBaseData() {
    // /** @type {FFLEActor} */
    // const actor = this.parent;

    // /** @type {number} */
    // const apl = this.apl ?? 1;

    /** @type {NPCTier} */
    const npcTier = this.npcTier ?? "normal";

    // Retrieve defenses, SD, attack, HP/MP, initiative
    // Tier + bonuses

    // Calculate ability modifier
    this.abilityModifier = NPCData.ABILITY_MODIFIERS[npcTier] ?? 2;

    this.noEED = ["normal", "notorious"].includes(npcTier);

    // Add trait points too
    /** @type {number} */
    const totalPoints = (this.extraPoints ?? 0) + (this.statusPoints ?? 0);
    this.totalPoints = totalPoints;

    const treasureDieSize = NPCData.TREASURE_DIE_SIZES[npcTier];

    const treasureDice = Math.floor(totalPoints / treasureDieSize);

    this.treasure = {
      dice: treasureDice,
      dieSize: treasureDieSize,
      dieModifier: totalPoints % treasureDieSize,
    };
  }
}
