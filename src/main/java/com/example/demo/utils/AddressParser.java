package com.example.demo.utils;

import com.example.demo.model.Address;

import java.util.Arrays;

/**
 * Parses a single-line address string like:
 *   "221B Baker Street, London, NW1 6XE, UK"
 * into an Address record.
 *
 * Intentionally lacks a test — used in the
 * "instructions before/after" demo (demo 04).
 */
public final class AddressParser {

    private AddressParser() {}

    public static Address parseAddress(String input) {
        if (input == null) {
            throw new IllegalArgumentException("address must be a string");
        }
        String[] parts = Arrays.stream(input.split(","))
                .map(String::trim)
                .filter(p -> !p.isEmpty())
                .toArray(String[]::new);
        if (parts.length < 4) {
            throw new IllegalArgumentException("address requires street, city, postal, country");
        }
        return new Address(parts[0], parts[1], parts[2], parts[3]);
    }
}
