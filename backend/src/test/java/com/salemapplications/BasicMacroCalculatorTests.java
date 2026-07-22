package com.salemapplications;

import com.salemapplications.Ingredient.Ingredient;
import com.salemapplications.Recipe.Recipe;
import com.salemapplications.RecipeIngredient.RecipeIngredient;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class BasicMacroCalculatorTests {
    private final BasicMacroCalculator macroCalculator = new BasicMacroCalculator();

    @Test
    void calculatesMacrosFromRecipeIngredientAmounts() {
        Ingredient oats = new Ingredient(1, "Oats", 100, "g", "grain", 389, 16.9, 6.9, 66.3, 10.6);
        Ingredient milk = new Ingredient(2, "Milk", 250, "ml", "dairy", 150, 8, 5, 12, 0);

        Recipe recipe = new Recipe("Oatmeal", "Mix together", 5);
        recipe.addIngredient(new RecipeIngredient(oats, 50, "g"));
        recipe.addIngredient(new RecipeIngredient(milk, 125, "ml"));

        Macros macros = macroCalculator.calculate(recipe);

        assertEquals(269.5, macros.calories());
        assertEquals(12.45, macros.protein());
        assertEquals(39.15, macros.carbohydrates());
        assertEquals(5.95, macros.fat());
        assertEquals(5.3, macros.fibre());
    }
}
