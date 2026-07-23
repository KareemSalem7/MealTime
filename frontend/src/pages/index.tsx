import { useEffect, useState } from "react";
import { createRecipe, deleteRecipe, getIngredients, getRecipes } from "../api/api-client";
import { MacroMode, type Ingredient, type Macros, type Recipe, type RecipeIngredient } from "../api/types";
import { getUnitForIngredientId } from "../constants/ingredients";

type IngredientRow = {
  ingredientId: string;
  amount: string;
  unit: string;
};

const emptyIngredientRow = (): IngredientRow => ({
  ingredientId: "",
  amount: "",
  unit: "",
});

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

function RecipeForm({
  ingredients,
  onCreated,
}: {
  ingredients: Ingredient[];
  onCreated: () => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [timeToCompleteMinutes, setTimeToCompleteMinutes] = useState("");
  const [servings, setServings] = useState("1");
  const [ingredientRows, setIngredientRows] = useState<IngredientRow[]>([emptyIngredientRow()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function updateIngredientRow(index: number, nextRow: Partial<IngredientRow>) {
    setIngredientRows((rows) => rows.map((row, rowIndex) => (rowIndex === index ? { ...row, ...nextRow } : row)));
  }

  function removeIngredientRow(index: number) {
    setIngredientRows((rows) => (rows.length === 1 ? [emptyIngredientRow()] : rows.filter((_, rowIndex) => rowIndex !== index)));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const recipeIngredients = ingredientRows
      .filter((row) => row.ingredientId && row.amount)
      .map((row) => ({
        ingredientId: Number(row.ingredientId),
        amount: Number(row.amount),
        unit: getUnitForIngredientId(Number(row.ingredientId)),
      }));

    if (!name.trim() || !instructions.trim()) {
      setFormError("Name and instructions are required.");
      return;
    }

    if (recipeIngredients.length === 0) {
      setFormError("Add at least one ingredient.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createRecipe({
        name: name.trim(),
        instructions: instructions.trim(),
        timeToCompleteMinutes: Number(timeToCompleteMinutes) || 0,
        servings: Number(servings) || 1,
        ingredients: recipeIngredients,
      });
      setName("");
      setInstructions("");
      setTimeToCompleteMinutes("");
      setServings("1");
      setIngredientRows([emptyIngredientRow()]);
      await onCreated();
    } catch (createError) {
      setFormError(createError instanceof Error ? createError.message : "Failed to create recipe.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Create recipe</h2>
        <p className="mt-1 text-sm text-slate-600">Add recipe details and choose ingredients from the ingredient table.</p>
      </div>

      <div className="mt-4 space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-600"
            placeholder="Chicken rice bowl"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Time, minutes
            <input
              type="number"
              min="0"
              value={timeToCompleteMinutes}
              onChange={(event) => setTimeToCompleteMinutes(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-600"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Servings
            <input
              type="number"
              min="1"
              value={servings}
              onChange={(event) => setServings(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-600"
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Instructions
          <textarea
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            className="mt-1 min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-600"
            placeholder="Cook, combine, season, and serve."
          />
        </label>

        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-800">Ingredients</h3>
            <button
              type="button"
              onClick={() => setIngredientRows((rows) => [...rows, emptyIngredientRow()])}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Add row
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {ingredientRows.map((row, index) => {
              const selectedIngredient = ingredients.find((ingredient) => ingredient.id === Number(row.ingredientId));

              return (
                <div key={index} className="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[minmax(0,1fr)_110px_100px_auto]">
                  <select
                    value={row.ingredientId}
                    onChange={(event) => {
                      const ingredient = ingredients.find((item) => item.id === Number(event.target.value));
                      updateIngredientRow(index, {
                        ingredientId: event.target.value,
                        unit: ingredient?.id ? getUnitForIngredientId(ingredient.id) : "",
                      });
                    }}
                    className="min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-emerald-600"
                  >
                    <option value="">Select ingredient</option>
                    {ingredients.map((ingredient) => (
                      <option key={ingredient.id} value={ingredient.id}>
                        {ingredient.name} ({ingredient.category})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={row.amount}
                    onChange={(event) => updateIngredientRow(index, { amount: event.target.value })}
                    className="min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-emerald-600"
                    placeholder={selectedIngredient ? String(selectedIngredient.amount) : "Amount"}
                  />
                  <div className="min-w-0 rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700">
                    {selectedIngredient?.id ? getUnitForIngredientId(selectedIngredient.id) : "Unit"}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeIngredientRow(index)}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {formError ? <p className="mt-3 text-sm font-medium text-red-700">{formError}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 w-full rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Creating..." : "Create recipe"}
      </button>
    </form>
  );
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingRecipeId, setDeletingRecipeId] = useState<number | null>(null);
  const [macroMode, setMacroMode] = useState<MacroMode>(MacroMode.Total);

  async function loadRecipes() {
    const nextRecipes = await getRecipes(macroMode);
    setRecipes(nextRecipes);
  }

  useEffect(() => {
    async function loadPageData() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [nextRecipes, nextIngredients] = await Promise.all([getRecipes(macroMode), getIngredients()]);
        setRecipes(nextRecipes);
        setIngredients(nextIngredients);
      } catch (loadError) {
        setLoadError(loadError instanceof Error ? loadError.message : "Failed to load page data");
      } finally {
        setIsLoading(false);
      }
    }

    loadPageData();
  }, [macroMode]);

  async function handleDeleteRecipe(recipeId: number) {
    setDeletingRecipeId(recipeId);
    setActionError(null);

    try {
      await deleteRecipe(recipeId);
      setRecipes((currentRecipes) => currentRecipes.filter((recipe) => recipe.id !== recipeId));
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : "Failed to delete recipe.");
    } finally {
      setDeletingRecipeId(null);
    }
  }

  if (isLoading) {
    return <main className="mx-auto max-w-5xl px-6 py-10 text-slate-700">Loading recipes...</main>;
  }

  if (loadError) {
    return <main className="mx-auto max-w-5xl px-6 py-10 text-red-700">Could not load recipes: {loadError}</main>;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8 border-b border-gray-200 pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Recipes</h1>
            <p className="mt-2 text-sm text-slate-600">
              {recipes.length} saved recipes, {ingredients.length} ingredients available
            </p>
          </div>

          <div className="inline-flex rounded-md border border-gray-300 bg-white p-1 text-sm font-medium">
            <button
              type="button"
              className={`rounded px-3 py-1.5 ${macroMode === MacroMode.Total ? "bg-slate-950 text-white" : "text-slate-600"}`}
              onClick={() => setMacroMode(MacroMode.Total)}
            >
              Total
            </button>
            <button
              type="button"
              className={`rounded px-3 py-1.5 ${macroMode === MacroMode.PerServing ? "bg-slate-950 text-white" : "text-slate-600"}`}
              onClick={() => setMacroMode(MacroMode.PerServing)}
            >
              Per serving
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-8">
        <section className="max-w-4xl">
          <RecipeForm ingredients={ingredients} onCreated={loadRecipes} />
        </section>

        <section>
          {actionError ? <p className="mb-4 text-sm font-medium text-red-700">{actionError}</p> : null}

          {recipes.length === 0 ? (
            <p className="rounded-md border border-slate-200 bg-white p-4 text-slate-600">No recipes found.</p>
          ) : (
            <ul className="space-y-4">
              {recipes.map((recipe) => (
                <li key={recipe.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-medium text-slate-950">{recipe.name}</h2>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">
                        <span>{recipe.timeToCompleteMinutes} min</span>
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      disabled={deletingRecipeId === recipe.id}
                      className="shrink-0 rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-slate-400"
                    >
                      {deletingRecipeId === recipe.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>

                  <p className="mt-3 whitespace-pre-line text-slate-700">{recipe.instructions}</p>

                  <MacroSummary recipe={recipe} macroMode={macroMode} />

                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    <ul className="mt-3 space-y-1 text-sm text-slate-700">
                      {recipe.ingredients.map((recipeIngredient) => (
                        <li key={`${recipe.id}-${recipeIngredient.ingredientId}`} className="flex gap-2">
                          <span className="font-medium text-slate-950">
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
        </section>
      </div>
    </main>
  );
}
