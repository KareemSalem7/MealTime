import type { Recipe } from "./types";

export async function getRecipes(): Promise<Recipe[]> {
  const response = await fetch("/api/v1/recipes");

  if (!response.ok) {
    throw new Error(`Failed to fetch recipes: ${response.status}`);
  }

  return response.json();
}
