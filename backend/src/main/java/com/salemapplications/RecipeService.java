package com.salemapplications;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;

    public RecipeService(RecipeRepository recipeRepository, IngredientRepository ingredientRepository) {
        this.recipeRepository = recipeRepository;
        this.ingredientRepository = ingredientRepository;
    }

    // basically gets all recipe objects and returns them in a list
    // behind the scenes, it uses SQL to get all recipes from the database
    public List<Recipe> getRecipes() {
        return recipeRepository.findAll();
    }

    // the .save method adds the recipe object to the database
    public void addRecipe(Recipe recipe) {
        hydrateRecipeIngredients(recipe.getIngredients());
        recipe.setIngredients(recipe.getIngredients());
        recipeRepository.save(recipe);
    }

    public Recipe getRecipeById(Integer id) {
        if (!recipeRepository.existsById(id)) {
            return null;
        }

        return recipeRepository.findById(id).get();
    }

    public Recipe updateRecipe(Integer id, Recipe updatedRecipe) {
        if (!recipeRepository.existsById(id)) {
            return null;
        }

        Recipe existingRecipe = getRecipeById(id);

        existingRecipe.setName(updatedRecipe.getName());
        existingRecipe.setInstructions(updatedRecipe.getInstructions());
        existingRecipe.setTimeToCompleteMinutes(updatedRecipe.getTimeToCompleteMinutes());
        hydrateRecipeIngredients(updatedRecipe.getIngredients());
        existingRecipe.setIngredients(updatedRecipe.getIngredients());

        return recipeRepository.save(existingRecipe);
    }

    public String deleteRecipeById(Integer id) {
        // first check if the recipe exists
        if (!recipeRepository.existsById(id)) {
            return "Recipe not found";
        }

        recipeRepository.deleteById(id);
        return "Recipe with id: " + id + " deleted";
    }

    private void hydrateRecipeIngredients(List<RecipeIngredient> recipeIngredients) {
        if (recipeIngredients == null) {
            return;
        }

        for (RecipeIngredient recipeIngredient : recipeIngredients) {
            Integer ingredientId = recipeIngredient.getIngredientId();

            if (ingredientId == null && recipeIngredient.getIngredient() != null) {
                ingredientId = recipeIngredient.getIngredient().getId();
            }

            if (ingredientId == null) {
                throw new IllegalArgumentException("Recipe ingredients must include ingredientId");
            }

            if (recipeIngredient.getIngredient() == null) {
                recipeIngredient.setIngredient(ingredientRepository.getReferenceById(ingredientId));
            }
        }
    }
}
