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

export type Macros = {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fibre: number;
};

export type Recipe = {
  id: number;
  name: string;
  instructions: string;
  timeToCompleteMinutes: number;
  servings: number;
  ingredients: RecipeIngredient[] | null;
  macros?: Macros;
};
