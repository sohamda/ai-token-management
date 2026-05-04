package com.example.demo.api;

import com.example.demo.model.Order;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class OrderServiceTest {

    private final OrderService orderService = new OrderService();

    @Test
    void listOrders_returnsTwoOrders() {
        List<Order> orders = orderService.listOrders("u_42");

        assertThat(orders).hasSize(2);
    }

    @Test
    void listOrders_firstOrderHasExpectedFields() {
        Order first = orderService.listOrders("u_42").get(0);

        assertThat(first.id()).isEqualTo("o_1001");
        assertThat(first.total()).isEqualTo(49.50);
        assertThat(first.items()).containsExactly("Mug", "Sticker pack");
    }

    @Test
    void listOrders_secondOrderHasExpectedFields() {
        Order second = orderService.listOrders("u_42").get(1);

        assertThat(second.id()).isEqualTo("o_1002");
        assertThat(second.total()).isEqualTo(120.00);
        assertThat(second.items()).containsExactly("T-shirt", "Hoodie");
    }
}
