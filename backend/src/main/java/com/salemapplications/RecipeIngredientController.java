package com.salemapplications;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recipe-ingredients")
public class RecipeIngredientController {
    private final RecipeIngredientRepository recipeIngredientRepository;

    public RecipeIngredientController(RecipeIngredientRepository recipeIngredientRepository) {
        this.recipeIngredientRepository = recipeIngredientRepository;
    }

    @GetMapping("/recipe/{recipeId}")
    public List<RecipeIngredient> getRecipeIngredientsByRecipeId(@PathVariable Integer recipeId) {
        return recipeIngredientRepository.findByIdRecipeId(recipeId);
    }
}
