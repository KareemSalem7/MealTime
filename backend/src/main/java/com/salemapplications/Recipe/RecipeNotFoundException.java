package com.salemapplications.Recipe;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class RecipeNotFoundException extends RuntimeException {
    public RecipeNotFoundException(Integer recipeId) {
        super("Recipe with id " + recipeId + " not found");
    }
}
