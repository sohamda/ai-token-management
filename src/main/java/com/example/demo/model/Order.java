package com.example.demo.model;

import java.util.List;

public record Order(String id, double total, List<String> items) {
}
