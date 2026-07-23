package com.salemapplications;

import com.salemapplications.Ingredient.Ingredient;
import com.salemapplications.Recipe.Recipe;
import com.salemapplications.RecipeIngredient.RecipeIngredient;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;

// we declare this as a @service (similar to @component), so that spring boot
// injects it as a bean where it's needed in recipeService
// we use primary to identity this as the bean to be injected over the per serving calculator
@Service
@Primary
public class BasicMacroCalculator implements MacroCalculator {
    @Override
    public Macros calculate(Recipe recipe) {
        if (recipe == null) {
            return zeroMacros();
        }

        List<RecipeIngredient> recipeIngredients = recipe.getIngredients();

        if (recipeIngredients == null || recipeIngredients.isEmpty()) {
            return zeroMacros();
        }

        double calories = 0;
        double protein = 0;
        double carbohydrates = 0;
        double fat = 0;
        double fibre = 0;

        for (RecipeIngredient recipeIngredient : recipeIngredients) {
            Ingredient ingredient = recipeIngredient.getIngredient();

            if (ingredient == null) {
                throw new IllegalArgumentException("Recipe ingredient must include an ingredient");
            }

            if (ingredient.getAmount() == 0) {
                throw new IllegalArgumentException("Ingredient amount must be greater than 0");
            }

            // calculate the ratio of how much was used in the recipe to get
            // the amount of cals, protein, etc relative to the ingredient typical amount
            double ratio = recipeIngredient.getAmount() / ingredient.getAmount();

            calories += ingredient.getCalories() * ratio;
            protein += ingredient.getProtein() * ratio;
            carbohydrates += ingredient.getCarbohydrates() * ratio;
            fat += ingredient.getFat() * ratio;
            fibre += ingredient.getFibre() * ratio;
        }

        return new Macros(calories, protein, carbohydrates, fat, fibre);
    }

    private Macros zeroMacros() {
        return new Macros(0, 0, 0, 0, 0);
    }
}
