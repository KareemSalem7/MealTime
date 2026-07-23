package com.salemapplications.Recipe;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public List<RecipeResponse> getRecipes(@RequestParam(defaultValue = "false") boolean perServing) {
        return recipeService.getRecipesWithMacros(perServing);
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getRecipeById(
            @PathVariable Integer id,
            @RequestParam(defaultValue = "false") boolean perServing
    ) {
        return ResponseEntity.ok(recipeService.getRecipeWithMacrosById(id, perServing));
    }

    @PostMapping("")
    public void addRecipe(@RequestBody Recipe recipe) {
        recipeService.addRecipe(recipe);
    }

    @PutMapping("{id}")
    public ResponseEntity<?> updateRecipe(@PathVariable Integer id, @RequestBody Recipe recipe) {
        Recipe updatedRecipe = recipeService.updateRecipe(id, recipe);

        if (updatedRecipe == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recipe not found");
        }

        return ResponseEntity.ok(updatedRecipe);
    }

    @DeleteMapping("{id}")
    public String deleteRecipe(@PathVariable Integer id) {
        return recipeService.deleteRecipeById(id);
    }
}
