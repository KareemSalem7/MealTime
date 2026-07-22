export type Ingredient = {
  id?: number;
  name: string;
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fibre: number;
};

export type Recipe = {
  id: number;
  name: string;
  instructions: string;
  timeToCompleteMinutes: number;
  ingredients: Ingredient[] | null;
};
