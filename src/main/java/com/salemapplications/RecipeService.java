package com.salemapplications;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;

    public RecipeService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    // basically gets all recipe objects and returns them in a list
    // behind the scenes, it uses SQL to get all recipes from the database
    public List<Recipe> getRecipes() {
        return recipeRepository.findAll();
    }

    // the .save method adds the recipe object to the database
    public void addRecipe(Recipe recipe) {
        recipeRepository.save(recipe);
    }

    public Recipe getRecipeById(Integer id) {
        return recipeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Id: " + id + " Recipe not found"));
    }
}
