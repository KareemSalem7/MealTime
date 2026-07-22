package com.salemapplications;

import jakarta.persistence.Entity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String instructions;
    private int timeToCompleteMinutes;
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "recipe_id")
    private List<Ingredient> ingredients = new ArrayList<>();

    public Recipe() {
    }

    public Recipe(String name, String instructions, int timeToCompleteMinutes) {
        this.name = name;
        this.instructions = instructions;
        this.timeToCompleteMinutes = timeToCompleteMinutes;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public int getTimeToCompleteMinutes() {
        return timeToCompleteMinutes;
    }

    public void setTimeToCompleteMinutes(int timeToCompleteMinutes) {
        this.timeToCompleteMinutes = timeToCompleteMinutes;
    }

    public List<Ingredient> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<Ingredient> ingredients) {
        this.ingredients.clear();

        if (ingredients != null) {
            this.ingredients.addAll(ingredients);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Recipe recipe = (Recipe) o;
        return timeToCompleteMinutes == recipe.timeToCompleteMinutes && Objects.equals(id, recipe.id) && Objects.equals(name, recipe.name) && Objects.equals(instructions, recipe.instructions) && Objects.equals(ingredients, recipe.ingredients);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, instructions, timeToCompleteMinutes, ingredients);
    }

    @Override
    public String toString() {
        List<String> ingredientStrings = ingredients == null
                ? List.of()
                : ingredients.stream()
                        .map(Ingredient::toString)
                        .toList();

        return "Recipe{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", instructions='" + instructions + '\'' +
                ", timeToCompleteMinutes=" + timeToCompleteMinutes +
                ", ingredients=" + ingredientStrings +
                '}';
    }
}
