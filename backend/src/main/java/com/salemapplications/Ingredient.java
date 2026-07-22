package com.salemapplications;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.Objects;

// ingredient here refers to an ingredient object for a specific recipe
@Entity
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private double amount;
    private String unit;
    private String category;

    // the macros of the ingredient at this amount and unit
    private double calories;
    private double protein;
    private double fat;
    private double carbohydrates;
    private double fibre;

    public Ingredient() {
    }

    public Ingredient(String name, double amount, String unit, String category, double calories, double protein, double fat, double carbohydrates, double fibre) {
        this.name = name;
        this.amount = amount;
        this.unit = unit;
        this.category = category;
        this.calories = calories;
        this.protein = protein;
        this.fat = fat;
        this.carbohydrates = carbohydrates;
        this.fibre = fibre;
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

    public double getCalories() {
        return calories;
    }

    public void setCalories(double calories) {
        this.calories = calories;
    }

    public double getProtein() {
        return protein;
    }

    public void setProtein(double protein) {
        this.protein = protein;
    }

    public double getFat() {
        return fat;
    }

    public void setFat(double fat) {
        this.fat = fat;
    }

    public double getCarbohydrates() {
        return carbohydrates;
    }

    public void setCarbohydrates(double carbohydrates) {
        this.carbohydrates = carbohydrates;
    }

    public double getFibre() {
        return fibre;
    }

    public void setFibre(double fibre) {
        this.fibre = fibre;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Ingredient that = (Ingredient) o;
        return Double.compare(amount, that.amount) == 0 && Double.compare(calories, that.calories) == 0 && Double.compare(protein, that.protein) == 0 && Double.compare(fat, that.fat) == 0 && Double.compare(carbohydrates, that.carbohydrates) == 0 && Double.compare(fibre, that.fibre) == 0 && Objects.equals(id, that.id) && Objects.equals(name, that.name) && Objects.equals(unit, that.unit);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, amount, unit, calories, protein, fat, carbohydrates, fibre);
    }

    @Override
    public String toString() {
        return amount + " " + unit + " " + name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
