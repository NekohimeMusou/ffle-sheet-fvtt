import { FFLE } from "./config.mjs";

export function configureStatusEffects() {
  CONFIG.statusEffects = [...negativeConditions, ...positiveConditions];
  CONFIG.specialStatusEffects.FLY = "float";
}

const positiveConditions = Object.keys(FFLE.positiveConditions).map(
  (condition) => ({
    id: `${condition}`,
    name: `FFLE.conditions.${condition}`,
    img: `systems/ffle-sheet/img/icons/conditions/${condition}.png`,
  }),
);

const negativeConditions = Object.keys(FFLE.negativeConditions).map(
  (condition) => ({
    id: `${condition}`,
    name: `FFLE.conditions.${condition}`,
    img: `systems/ffle-sheet/img/icons/conditions/${condition}.png`,
  }),
);
