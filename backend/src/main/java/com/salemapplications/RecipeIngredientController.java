package com.salemapplications;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recipe-ingredients")
public class RecipeIngredientController {
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;

    public RecipeIngredientController(
            RecipeIngredientRepository recipeIngredientRepository,
            RecipeRepository recipeRepository,
            IngredientRepository ingredientRepository) {
        this.recipeIngredientRepository = recipeIngredientRepository;
        this.recipeRepository = recipeRepository;
        this.ingredientRepository = ingredientRepository;
    }

    @GetMapping("/recipe/{recipeId}")
    public List<RecipeIngredient> getRecipeIngredientsByRecipeId(@PathVariable Integer recipeId) {
        return recipeIngredientRepository.findByIdRecipeId(recipeId);
    }

    @PostMapping("/recipe/{recipeId}/ingredient")
    public ResponseEntity<?> addIngredientToRecipe(
            @PathVariable Integer recipeId,
            @RequestBody RecipeIngredient requestedRecipeIngredient) {
        Recipe recipe = recipeRepository.findById(recipeId).orElse(null);

        if (recipe == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recipe not found");
        }

        Integer ingredientId = requestedRecipeIngredient.getIngredientId();

        if (ingredientId == null) {
            return ResponseEntity.badRequest().body("ingredientId is required");
        }

        Ingredient ingredient = ingredientRepository.findById(ingredientId).orElse(null);

        if (ingredient == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ingredient not found");
        }

        RecipeIngredient recipeIngredient = new RecipeIngredient(
                ingredient,
                requestedRecipeIngredient.getAmount(),
                requestedRecipeIngredient.getUnit());
        recipeIngredient.setRecipe(recipe);

        return ResponseEntity.ok(recipeIngredientRepository.save(recipeIngredient));
    }

    @DeleteMapping("/recipe/{recipeId}/ingredient/{ingredientId}")
    public ResponseEntity<?> removeIngredientFromRecipe(
            @PathVariable Integer recipeId,
            @PathVariable Integer ingredientId) {

        if (!recipeRepository.existsById(recipeId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recipe not found");
        }

        RecipeIngredientId id = new RecipeIngredientId(recipeId, ingredientId);

        if (!recipeIngredientRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ingredient not found in recipe");
        }

        recipeIngredientRepository.deleteById(id);
        return ResponseEntity.ok("Ingredient removed from recipe");
    }
}
