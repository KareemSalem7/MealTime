import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { getRecipes } from "../api/api-client";
import type { Recipe } from "../api/types";

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
    return <main>Loading recipes...</main>;
  }

  if (error) {
    return <main>Could not load recipes: {error}</main>;
  }

  return (
    <main>
      <h1>Recipes</h1>
      {recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <h2>{recipe.name}</h2>
              <p>{recipe.timeToCompleteMinutes} minutes</p>
              <p>{recipe.instructions}</p>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <ul>
                  {recipe.ingredients.map((ingredient) => (
                    <li key={`${recipe.id}-${ingredient.name}`}>
                      {ingredient.amount} {ingredient.unit} {ingredient.name}
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
