import { FFLE } from "./config.mjs";

const ICON_PATH = "systems/ffle-sheet/img/icons/conditions/";
const ICON_EXTENSION = "png";

export function configureStatusEffects() {
  CONFIG.statusEffects = [...negativeConditions, ...positiveConditions];
  CONFIG.specialStatusEffects.FLY = "float";
}

// Do these separately so they'll be listed separately, unless a module sorts them
const positiveConditions = Object.keys(FFLE.positiveConditions).map(
  (condition) => ({
    id: `${condition}`,
    name: `FFLE.conditions.${condition}`,
    img: `${ICON_PATH}${condition}.${ICON_EXTENSION}`,
  }),
);

const negativeConditions = Object.keys(FFLE.negativeConditions).map(
  (condition) => ({
    id: `${condition}`,
    name: `FFLE.conditions.${condition}`,
    img: `${ICON_PATH}${condition}.${ICON_EXTENSION}`,
  }),
);
