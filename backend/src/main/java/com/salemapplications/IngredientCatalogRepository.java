package com.salemapplications;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredientCatalogRepository
        extends JpaRepository<IngredientCatalog, Integer> {
}
