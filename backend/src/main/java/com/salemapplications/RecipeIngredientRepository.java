package com.salemapplications;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeIngredientRepository
        extends JpaRepository<RecipeIngredient, RecipeIngredientId> {
    List<RecipeIngredient> findByIdRecipeId(Integer recipeId);
}
