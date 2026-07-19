package com.salemapplications;

import jakarta.persistence.Embeddable;

@Embeddable
public record Ingredient(
        String name,
        double amount,
        String unit
) {
    @Override
    public String toString() {
        return amount + " " + unit + " " + name;
    }
}
