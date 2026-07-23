// forces units of measure for these ingredients
export const ingredientUnitOverrides: Record<number, string> = {
  41: "eggs",
  42: "eggs",
  48: "ml",
  49: "ml",
  68: "apple",
  69: "apricot",
  70: "banana",
  77: "fruit",
  79: "lemon",
  80: "lime",
  81: "fruits",
  86: "fruit",
  87: "peach",
  89: "fruit",
  93: "fruit",
  125: "tsp",
  127: "tsp",
  128: "ml",
  137: "tbsp",
  139: "tbsp",
  164: "ml",
};

// unless it's in the above map, use grams as the unit of measure
export function getUnitForIngredientId(ingredientId: number) {
  return ingredientUnitOverrides[ingredientId] ?? "g";
}
