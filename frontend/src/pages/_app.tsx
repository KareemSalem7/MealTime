import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { getRecipes } from "../api/api-client";
import type { Recipe, RecipeIngredient } from "../api/types";

function getIngredientName(recipeIngredient: RecipeIngredient) {
  return recipeIngredient.name ?? recipeIngredient.ingredient?.name ?? `Ingredient ${recipeIngredient.ingredientId}`;
}

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRecipes() {
      try {
        const nextRecipes = await getRecipes();
        setRecipes(nextRecipes);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to fetch recipes");
      } finally {
        setIsLoading(false);
      }
    }

    loadRecipes();
  }, []);

  if (isLoading) {
    return <main className="mx-auto max-w-3xl px-6 py-10">Loading recipes...</main>;
  }

  if (error) {
    return <main className="mx-auto max-w-3xl px-6 py-10">Could not load recipes: {error}</main>;
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-semibold text-gray-950">Recipes</h1>
        <p className="mt-2 text-sm text-gray-600">{recipes.length} saved recipes</p>
      </header>

      {recipes.length === 0 ? (
        <p className="text-gray-600">No recipes found.</p>
      ) : (
        <ul className="space-y-5">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="border-b border-gray-200 pb-5 last:border-b-0">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-medium text-gray-950">{recipe.name}</h2>
                <span className="shrink-0 text-sm text-gray-500">
                  {recipe.timeToCompleteMinutes} min
                </span>
              </div>

              <p className="mt-2 text-gray-700">{recipe.instructions}</p>

              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <ul className="mt-3 space-y-1 text-sm text-gray-700">
                  {recipe.ingredients.map((recipeIngredient) => (
                    <li key={`${recipe.id}-${recipeIngredient.ingredientId}`} className="flex gap-2">
                      <span className="font-medium text-gray-950">
                        {recipeIngredient.amount} {recipeIngredient.unit}
                      </span>
                      <span>{getIngredientName(recipeIngredient)}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
