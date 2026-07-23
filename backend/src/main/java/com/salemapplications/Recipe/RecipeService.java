package com.salemapplications.Recipe;

import com.salemapplications.Ingredient.IngredientRepository;
import com.salemapplications.MacroCalculator;
import com.salemapplications.Macros;
import com.salemapplications.RecipeIngredient.RecipeIngredient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;
    private final MacroCalculator totalMacroCalculator;
    private final MacroCalculator perServingMacroCalculator;

    // we use qualifier to tell spring to inject the basicMacroCalculator bean for totalMacroCalculator, and
    // the perServingCalculator for perServingMacroCalculator
    public RecipeService(
            RecipeRepository recipeRepository,
            IngredientRepository ingredientRepository,
            @Qualifier("basicMacroCalculator") MacroCalculator totalMacroCalculator,
            @Qualifier("perServingCalculator") MacroCalculator perServingMacroCalculator
    ) {
        this.recipeRepository = recipeRepository;
        this.ingredientRepository = ingredientRepository;
        this.totalMacroCalculator = totalMacroCalculator;
        this.perServingMacroCalculator = perServingMacroCalculator;
    }

    // basically gets all recipe objects and returns them in a list
    // behind the scenes, it uses SQL to get all recipes from the database
    public List<Recipe> getRecipes() {
        return recipeRepository.findAll();
    }

    public List<RecipeResponse> getRecipesWithMacros(boolean perServing) {
        MacroCalculator calculator = selectMacroCalculator(perServing);

        return recipeRepository.findAll().stream()
                .map(recipe -> new RecipeResponse(recipe, calculator.calculate(recipe)))
                .toList();
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

    public RecipeResponse getRecipeWithMacrosById(Integer id, boolean perServing) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RecipeNotFoundException(id));

        return new RecipeResponse(recipe, selectMacroCalculator(perServing).calculate(recipe));
    }

    public Recipe updateRecipe(Integer id, Recipe updatedRecipe) {
        if (!recipeRepository.existsById(id)) {
            return null;
        }

        Recipe existingRecipe = getRecipeById(id);

        existingRecipe.setName(updatedRecipe.getName());
        existingRecipe.setInstructions(updatedRecipe.getInstructions());
        existingRecipe.setTimeToCompleteMinutes(updatedRecipe.getTimeToCompleteMinutes());
        existingRecipe.setServings(updatedRecipe.getServings());
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

    // calculate macros depends on an interface which can be implemented by different classes
    // to change implementation without changing this class (Open-closed principle)
    public Macros calculateMacros(Integer recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() ->
                        new RecipeNotFoundException(recipeId));

        return totalMacroCalculator.calculate(recipe);
    }

    // if the per serving option is selected, use the perServingMacroCalculator implementation
    // otherwise, use the
    private MacroCalculator selectMacroCalculator(boolean perServing) {
        return perServing ? perServingMacroCalculator : totalMacroCalculator;
    }

}
