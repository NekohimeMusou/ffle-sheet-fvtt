/** @import { NPCTier } from "../../../config/config.mjs" */
import FFLEBaseActorData from "../base/base-actor.mjs";
import { FFLE } from "../../../config/config.mjs";
import { getNPCAbility } from "./ability-tables.mjs";

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

    sturdyArmor: new fields.BooleanField(),

    npcAttackBonus: new fields.NumberField({ integer: true, initial: 0 }),

    npcDefenseBonus: new fields.SchemaField({
      phys: new fields.NumberField({ integer: true, initial: 0 }),
      mag: new fields.NumberField({ integer: true, initial: 0 }),
      skill: new fields.NumberField({ integer: true, initial: 0 }),
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
   * @static
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

  /**
   * @readonly
   * @static
   */
  static MAX_BONUS_LEVELS = {
    normal: 3,
    notorious: 2,
    boss: 1,
    endBoss: 0,
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
    super.prepareBaseData();
    // /** @type {FFLEActor} */
    // const actor = this.parent;

    /** @type {number} */
    const level = this.level ?? 1;

    /** @type {NPCTier} */
    const npcTier = this.npcTier ?? "normal";

    // If the NPC's tier increased, cap off the trait bonus levels
    this.maxBonusLevel = NPCData.MAX_BONUS_LEVELS[npcTier] ?? 0;
    for (const trait of Object.keys(this.traitMods)) {
      this.traitMods[trait] = Math.min(
        this.traitMods[trait],
        this.maxBonusLevel,
      );
    }

    // Retrieve defenses, SD, attack, HP/MP, initiative
    // Tier + bonuses

    /** @type {Record<string, boolean>} */
    const { swapHpMp, swapPdSd } = this.extraMods;

    this.initiative = getNPCAbility(
      "initiative",
      npcTier,
      level,
      this.traitMods.initiative,
    );

    const hpMpTrait = getNPCAbility(
      "hpMp",
      npcTier,
      level,
      this.traitMods.hpMp,
    );

    this.hp.max = swapHpMp ? Math.floor(hpMpTrait / 2) : hpMpTrait;
    this.mp.max = swapHpMp ? hpMpTrait : Math.floor(hpMpTrait / 2);

    this.attackMod =
      getNPCAbility("attack", npcTier, level, this.traitMods.attack) +
      this.npcAttackBonus;

    this.defense.skill =
      getNPCAbility(
        "skillDefense",
        npcTier,
        level,
        this.traitMods.skillDefense,
      ) +
      (this.sturdyArmor ? 5 : 0) +
      this.npcDefenseBonus.skill;

    const defenseTrait = getNPCAbility(
      "defense",
      npcTier,
      level,
      this.traitMods.defense,
    );

    this.defense.phys =
      (swapPdSd ? Math.floor(defenseTrait / 2) : defenseTrait) +
      this.armorBonus.phys +
      this.npcDefenseBonus.phys;
    this.defense.mag =
      (swapPdSd ? defenseTrait : Math.floor(defenseTrait / 2)) +
      this.armorBonus.mag +
      this.npcDefenseBonus.mag;

    // Calculate ability modifier
    this.abilityModifier = NPCData.ABILITY_MODIFIERS[npcTier] ?? 2;

    this.noEED = ["normal", "notorious"].includes(npcTier);

    /** @type {number} */
    const traitPoints = Object.values(this.traitMods).reduce(
      (prev, curr) => prev + curr,
      0,
    );
    /** @type {number} */
    const totalPoints =
      (this.extraPoints ?? 0) + (this.statusPoints ?? 0) + traitPoints;
    this.totalPoints = totalPoints;

    const treasureDieSize = NPCData.TREASURE_DIE_SIZES[npcTier];

    const treasureDice = Math.max(1, Math.floor(totalPoints / treasureDieSize));

    this.treasure = {
      dice: treasureDice,
      dieSize: treasureDieSize,
      dieModifier: totalPoints % treasureDieSize,
    };
  }
}
