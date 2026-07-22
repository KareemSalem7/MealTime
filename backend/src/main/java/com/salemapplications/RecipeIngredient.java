package com.salemapplications;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

import java.util.Objects;

// RecipeIngredient maps one recipe to one ingredient and stores recipe-specific usage details.
@Entity
@Table(name = "recipeingredient")
public class RecipeIngredient {
    @EmbeddedId
    @JsonUnwrapped
    private RecipeIngredientId id = new RecipeIngredientId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("recipeId")
    @JoinColumn(name = "recipe_id")
    @JsonIgnore
    private Recipe recipe;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("ingredientId")
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient;

    private double amount;
    private String unit;

    public RecipeIngredient() {
    }

    public RecipeIngredient(Ingredient ingredient, double amount, String unit) {
        setIngredient(ingredient);
        this.amount = amount;
        this.unit = unit;
    }

    @JsonIgnore
    public RecipeIngredientId getId() {
        return id;
    }

    public void setId(RecipeIngredientId id) {
        this.id = id == null ? new RecipeIngredientId() : id;
    }

    public Integer getRecipeId() {
        return id.getRecipeId();
    }

    public void setRecipeId(Integer recipeId) {
        id.setRecipeId(recipeId);
    }

    public Integer getIngredientId() {
        return id.getIngredientId();
    }

    public void setIngredientId(Integer ingredientId) {
        id.setIngredientId(ingredientId);
    }

    public Recipe getRecipe() {
        return recipe;
    }

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
        if (recipe != null) {
            id.setRecipeId(recipe.getId());
        }
    }

    public Ingredient getIngredient() {
        return ingredient;
    }

    public void setIngredient(Ingredient ingredient) {
        this.ingredient = ingredient;
        if (ingredient != null) {
            id.setIngredientId(ingredient.getId());
        }
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getName() {
        return ingredient == null ? null : ingredient.getName();
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        RecipeIngredient that = (RecipeIngredient) o;
        return Double.compare(amount, that.amount) == 0 && Objects.equals(id, that.id) && Objects.equals(ingredient, that.ingredient) && Objects.equals(unit, that.unit);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, ingredient, amount, unit);
    }

    @Override
    public String toString() {
        return amount + " " + unit + " " + getName();
    }
}
