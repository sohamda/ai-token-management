package com.example.demo.api;

import com.example.demo.model.Order;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    public List<Order> listOrders(String userId) {
        return List.of(
                new Order("o_1001", 49.50, List.of("Mug", "Sticker pack")),
                new Order("o_1002", 120.00, List.of("T-shirt", "Hoodie"))
        );
    }
}
