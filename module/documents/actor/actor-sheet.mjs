const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export default class FFLEActorSheet extends HandlebarsApplicationMixin(
  ActorSheetV2,
) {}
