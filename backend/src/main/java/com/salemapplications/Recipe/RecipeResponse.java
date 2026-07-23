package com.salemapplications.Recipe;

import com.salemapplications.Macros;
import com.salemapplications.RecipeIngredient.RecipeIngredient;

import java.util.List;

public record RecipeResponse(
        Integer id,
        String name,
        String instructions,
        int timeToCompleteMinutes,
        List<RecipeIngredient> ingredients,
        Macros macros
) {
    public RecipeResponse(Recipe recipe, Macros macros) {
        this(
                recipe.getId(),
                recipe.getName(),
                recipe.getInstructions(),
                recipe.getTimeToCompleteMinutes(),
                recipe.getIngredients(),
                macros
        );
    }
}
