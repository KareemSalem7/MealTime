package com.salemapplications.Recipe;

import org.springframework.data.jpa.repository.JpaRepository;

// the data type for the key is Integer, so we put Integer
public interface RecipeRepository
        extends JpaRepository<Recipe, Integer> {
}
