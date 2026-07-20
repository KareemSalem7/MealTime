export type Ingredient = {
  name: string;
  amount: number;
  unit: string;
};

export type Recipe = {
  id: number;
  name: string;
  instructions: string;
  timeToCompleteMinutes: number;
  ingredients: Ingredient[] | null;
};
