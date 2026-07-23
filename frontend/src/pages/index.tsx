import { useEffect, useState } from "react";
import { getRecipes } from "../api/api-client";
import { MacroMode, type Macros, type Recipe, type RecipeIngredient } from "../api/types";

function getIngredientName(recipeIngredient: RecipeIngredient) {
  return recipeIngredient.name ?? recipeIngredient.ingredient?.name ?? `Ingredient ${recipeIngredient.ingredientId}`;
}

function formatMacro(value: number) {
  return Math.round(value * 10) / 10;
}

function calculateFallbackMacros(recipe: Recipe, macroMode: MacroMode): Macros | null {
  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    return null;
  }

  const totals = recipe.ingredients.reduce<Macros>(
    (totals, recipeIngredient) => {
      const ingredient = recipeIngredient.ingredient;

      if (!ingredient || ingredient.amount === 0) {
        return totals;
      }

      const ratio = recipeIngredient.amount / ingredient.amount;

      return {
        calories: totals.calories + ingredient.calories * ratio,
        protein: totals.protein + ingredient.protein * ratio,
        carbohydrates: totals.carbohydrates + ingredient.carbohydrates * ratio,
        fat: totals.fat + ingredient.fat * ratio,
        fibre: totals.fibre + ingredient.fibre * ratio,
      };
    },
    { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fibre: 0 },
  );

  if (macroMode === MacroMode.Total) {
    return totals;
  }

  const servings = recipe.servings > 0 ? recipe.servings : 1;

  return {
    calories: totals.calories / servings,
    protein: totals.protein / servings,
    carbohydrates: totals.carbohydrates / servings,
    fat: totals.fat / servings,
    fibre: totals.fibre / servings,
  };
}

function MacroSummary({ recipe, macroMode }: { recipe: Recipe; macroMode: MacroMode }) {
  const macros = recipe.macros ?? calculateFallbackMacros(recipe, macroMode);

  if (!macros) {
    return null;
  }

  const items = [
    ["Calories", formatMacro(macros.calories)],
    ["Protein", `${formatMacro(macros.protein)}g`],
    ["Carbs", `${formatMacro(macros.carbohydrates)}g`],
    ["Fat", `${formatMacro(macros.fat)}g`],
    ["Fibre", `${formatMacro(macros.fibre)}g`],
  ];

  return (
    <dl className="mt-4 grid grid-cols-2 gap-3 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm sm:grid-cols-5">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs font-medium uppercase text-gray-500">{label}</dt>
          <dd className="mt-1 font-semibold text-gray-950">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [macroMode, setMacroMode] = useState<MacroMode>(MacroMode.Total);

  useEffect(() => {
    async function loadRecipes() {
      setIsLoading(true);
      setError(null);

      try {
        const nextRecipes = await getRecipes(macroMode);
        setRecipes(nextRecipes);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to fetch recipes");
      } finally {
        setIsLoading(false);
      }
    }

    loadRecipes();
  }, [macroMode]);

  if (isLoading) {
    return <main className="mx-auto max-w-3xl px-6 py-10">Loading recipes...</main>;
  }

  if (error) {
    return <main className="mx-auto max-w-3xl px-6 py-10">Could not load recipes: {error}</main>;
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8 border-b border-gray-200 pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-950">Recipes</h1>
            <p className="mt-2 text-sm text-gray-600">{recipes.length} saved recipes</p>
          </div>

          <div className="inline-flex rounded-md border border-gray-300 bg-white p-1 text-sm font-medium">
            <button
              type="button"
              className={`rounded px-3 py-1.5 ${macroMode === MacroMode.Total ? "bg-gray-950 text-white" : "text-gray-600"}`}
              onClick={() => setMacroMode(MacroMode.Total)}
            >
              Total
            </button>
            <button
              type="button"
              className={`rounded px-3 py-1.5 ${macroMode === MacroMode.PerServing ? "bg-gray-950 text-white" : "text-gray-600"}`}
              onClick={() => setMacroMode(MacroMode.PerServing)}
            >
              Per serving
            </button>
          </div>
        </div>
      </header>

      {recipes.length === 0 ? (
        <p className="text-gray-600">No recipes found.</p>
      ) : (
        <ul className="space-y-5">
          {recipes.map((recipe) => (
            <li key={recipe.id} className="border-b border-gray-200 pb-5 last:border-b-0">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-medium text-gray-950">{recipe.name}</h2>
                <div className="shrink-0 text-right text-sm text-gray-500">
                  <div>{recipe.timeToCompleteMinutes} min</div>
                  <div>{recipe.servings} servings</div>
                </div>
              </div>

              <p className="mt-2 text-gray-700">{recipe.instructions}</p>

              <MacroSummary recipe={recipe} macroMode={macroMode} />

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
