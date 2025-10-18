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

export const FFLE = {
  PACKAGE_ID,
  resourceTypes,
  defenseTypes,
};
