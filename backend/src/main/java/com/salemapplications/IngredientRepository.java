package com.salemapplications;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredientRepository
        extends JpaRepository<Ingredient, Integer> {
}
