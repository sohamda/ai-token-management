package com.example.demo.email;

import com.example.demo.model.EmailResult;
import com.example.demo.model.Order;
import com.example.demo.model.User;
import org.springframework.stereotype.Service;

import java.util.Map;

// Old, hand-rolled email builder. The demo refactor replaces this
// with the new templateEngine.render() call.
@Service
public class OrderConfirmationService {

    private final TemplateEngine templateEngine;

    public OrderConfirmationService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public EmailResult sendOrderConfirmation(User user, Order order) {
        String subject = "Your order " + order.id() + " is confirmed";
        String body = templateEngine.renderLegacy("order_confirmation_v1", Map.of(
                "name", user.name(),
                "orderId", order.id(),
                "total", order.total(),
                "items", order.items()
        ));
        return deliver(user.email(), subject, body);
    }

    private EmailResult deliver(String to, String subject, String body) {
        // pretend to send
        return new EmailResult(to, subject, body.length());
    }
}
