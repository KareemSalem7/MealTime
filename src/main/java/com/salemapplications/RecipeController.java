package com.salemapplications;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    // Get method for getting the list of recipes
    // now we return the list using our service, which queries from the database
    @GetMapping("")
    public List<Recipe> getRecipes() {
        return recipeService.getRecipes();
    }

    @GetMapping("{id}")
    public Recipe getRecipeById(@PathVariable Integer id) {
        return recipeService.getRecipeById(id);
    }

    @PostMapping("")
    public void addRecipe(@RequestBody Recipe recipe) {
        recipeService.addRecipe(recipe);
    }
}
