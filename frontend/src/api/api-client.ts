import { MacroMode, type CreateRecipeRequest, type Ingredient, type Recipe } from "./types";

const API_BASE_PATH = "/api/v1";

export async function getRecipes(macroMode: MacroMode = MacroMode.Total): Promise<Recipe[]> {
  const params = new URLSearchParams({
    perServing: String(macroMode === MacroMode.PerServing),
  });
  const response = await fetch(`${API_BASE_PATH}/recipes?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch recipes: ${response.status}`);
  }

  return response.json();
}

export async function getIngredients(): Promise<Ingredient[]> {
  const response = await fetch(`${API_BASE_PATH}/ingredients`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ingredients: ${response.status}`);
  }

  return response.json();
}

export async function createRecipe(recipe: CreateRecipeRequest): Promise<void> {
  const response = await fetch(`${API_BASE_PATH}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe),
  });

  if (!response.ok) {
    throw new Error(`Failed to create recipe: ${response.status}`);
  }
}

export async function deleteRecipe(recipeId: number): Promise<void> {
  const response = await fetch(`${API_BASE_PATH}/recipes/${recipeId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete recipe: ${response.status}`);
  }
}
