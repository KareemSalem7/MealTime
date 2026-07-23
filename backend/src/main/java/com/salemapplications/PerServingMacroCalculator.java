package com.salemapplications;

import com.salemapplications.Recipe.Recipe;
import org.springframework.stereotype.Service;

@Service("perServingCalculator")
public class PerServingMacroCalculator implements MacroCalculator {

    private final MacroCalculator baseCalculator;

    public PerServingMacroCalculator(BasicMacroCalculator baseCalculator) {
        this.baseCalculator = baseCalculator;
    }

    @Override
    public Macros calculate(Recipe recipe) {
        Macros totalMacros = baseCalculator.calculate(recipe);

        // Guard against zero/missing servings to avoid division by zero
        int servings = (recipe == null || recipe.getServings() <= 0) ? 1 : recipe.getServings();

        return new Macros(
                totalMacros.calories() / servings,
                totalMacros.protein() / servings,
                totalMacros.carbohydrates() / servings,
                totalMacros.fat() / servings,
                totalMacros.fibre() / servings
        );
    }
}
