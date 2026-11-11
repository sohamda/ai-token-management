package com.example.demo.email;

import com.example.demo.model.EmailResult;
import com.example.demo.model.Order;
import com.example.demo.model.User;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class OrderConfirmationServiceTest {

    private final TemplateEngine engine = new TemplateEngine();
    private final OrderConfirmationService service = new OrderConfirmationService(engine);

    @Test
    void sendOrderConfirmation_returnsCorrectRecipient() {
        User user = new User("u_1", "Ada", "ada@example.com");
        Order order = new Order("o_1", 49.50, List.of("Mug"));

        EmailResult result = service.sendOrderConfirmation(user, order);

        assertThat(result.to()).isEqualTo("ada@example.com");
    }

    @Test
    void sendOrderConfirmation_subjectContainsOrderId() {
        User user = new User("u_1", "Ada", "ada@example.com");
        Order order = new Order("o_1", 49.50, List.of("Mug"));

        EmailResult result = service.sendOrderConfirmation(user, order);

        assertThat(result.subject()).contains("o_1");
    }

    @Test
    void sendOrderConfirmation_bodyLengthIsPositive() {
        User user = new User("u_1", "Ada", "ada@example.com");
        Order order = new Order("o_1", 49.50, List.of("Mug"));

        EmailResult result = service.sendOrderConfirmation(user, order);

        assertThat(result.bytes()).isGreaterThan(0);
    }

    /**
     * Asserts the legacy body shape. It calls renderLegacy directly, so
     * migrating OrderConfirmationService to render("order_confirmation_v2")
     * (the v2 body says "is on the way" instead of "confirmed") does not
     * fail it. Demo 08 uses that gap: Ralph is only as good as your tests.
     */
    @Test
    void sendOrderConfirmation_bodyContainsLegacyShape() {
        TemplateEngine eng = new TemplateEngine();
        OrderConfirmationService svc = new OrderConfirmationService(eng);
        User user = new User("u_1", "Ada", "ada@example.com");
        Order order = new Order("o_1", 49.50, List.of("Mug"));

        // Invoke the service, then re-render to inspect actual body text
        String body = eng.renderLegacy("order_confirmation_v1", java.util.Map.of(
                "name", user.name(),
                "orderId", order.id(),
                "total", order.total(),
                "items", order.items()
        ));

        assertThat(body).contains("Order o_1 confirmed");
        assertThat(body).contains(" - Mug");
    }
}
