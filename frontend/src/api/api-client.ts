import type { Recipe } from "./types";

const API_BASE_PATH = "/api/v1";

export async function getRecipes(): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE_PATH}/recipes`);

  if (!response.ok) {
    throw new Error(`Failed to fetch recipes: ${response.status}`);
  }

  return response.json();
}
