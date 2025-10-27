const PACKAGE_ID = "ffle-sheet";

const resourceTypes = {
  hp: "FFLE.resourceTypes.hp",
  mp: "FFLE.resourceTypes.mp",
};

/**
 * @typedef {keyof typeof defenseTypes} DefenseType
 */
const defenseTypes = {
  phys: "FFLE.defenseTypes.phys",
  mag: "FFLE.defenseTypes.mag",
  skill: "FFLE.defenseTypes.skill",
};

/**
 * @typedef {keyof typeof npcTiers} NPCTier
 */
const npcTiers = {
  normal: "FFLE.npc.tier.normal",
  notorious: "FFLE.npc.tier.notorious",
  boss: "FFLE.npc.tier.boss",
  endBoss: "FFLE.npc.tier.endBoss",
};

/**
 * @typedef {keyof typeof negativeConditions} NegativeCondition
 */
const negativeConditions = {
  battered: "FFLE.conditions.battered",
  berserk: "FFLE.conditions.berserk",
  blind: "FFLE.conditions.blind",
  bleeding: "FFLE.conditions.bleeding",
  charm: "FFLE.conditions.charm",
  confuse: "FFLE.conditions.confuse",
  entangled: "FFLE.conditions.entangled",
  knockdown: "FFLE.conditions.knockdown",
  paralyzed: "FFLE.conditions.paralyzed",
  petrify: "FFLE.conditions.petrify",
  poison: "FFLE.conditions.poison",
  prone: "FFLE.conditions.prone",
  // Missing icon
  // seal: "FFLE.conditions.seal",
  slow: "FFLE.conditions.slow",
  sleep: "FFLE.conditions.sleep",
  silence: "FFLE.conditions.silence",
  stop: "FFLE.conditions.stop",
  stun: "FFLE.conditions.stun",
  zombie: "FFLE.conditions.zombie",
};

/**
 * @typedef {keyof typeof positiveConditions} PositiveCondition
 */
const positiveConditions = {
  autoLife: "FFLE.conditions.autoLife",
  float: "FFLE.conditions.float",
  haste: "FFLE.conditions.haste",
  invisible: "FFLE.conditions.invisible",
  protect: "FFLE.conditions.protect",
  reflect: "FFLE.conditions.reflect",
  regen: "FFLE.conditions.regen",
  shell: "FFLE.conditions.shell",
};

/**
 * @typedef {PositiveCondition | NegativeCondition} StatusCondition
 */
const statusConditions = {
  ...negativeConditions,
  ...positiveConditions,
};

export const FFLE = {
  PACKAGE_ID,
  resourceTypes,
  defenseTypes,
  npcTiers,
  negativeConditions,
  positiveConditions,
  statusConditions,
};
