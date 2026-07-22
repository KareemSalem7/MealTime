export type Ingredient = {
  id?: number;
  name: string;
  amount: number;
  unit: string;
  category: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fibre: number;
};

export type RecipeIngredient = {
  recipeId?: number;
  ingredientId: number;
  ingredient?: Ingredient;
  name?: string;
  amount: number;
  unit: string;
};

export type Recipe = {
  id: number;
  name: string;
  instructions: string;
  timeToCompleteMinutes: number;
  ingredients: RecipeIngredient[] | null;
};
