import { MacroMode, type Recipe } from "./types";

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
