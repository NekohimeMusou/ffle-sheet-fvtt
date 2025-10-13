const fields = foundry.data.fields;

export default function generateResourceSchema() {
  return {
    max: new fields.NumberField({
      integer: true,
      positive: true,
      initial: 1,
    }),
    value: new fields.NumberField({ integer: true, initial: 1 }),
  };
}
