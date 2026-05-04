package com.example.demo.email;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.function.Function;

/**
 * New template engine. All new emails should use render(); legacy
 * code still calls renderLegacy() until migrated.
 */
@Component
public class TemplateEngine {

    private static final Map<String, Function<Map<String, Object>, String>> TEMPLATES = Map.of(
            "welcome", data -> "Hi " + data.get("name") + ", welcome to the demo!",
            "order_confirmation_v2", data ->
                    "Hi " + data.get("name") + ",\n\nYour order " + data.get("orderId")
                            + " for $" + data.get("total") + " is on the way.\n"
    );

    public String render(String templateId, Map<String, Object> data) {
        Function<Map<String, Object>, String> t = TEMPLATES.get(templateId);
        if (t == null) {
            throw new IllegalArgumentException("Unknown template: " + templateId);
        }
        return t.apply(data);
    }

    /** Legacy renderer — string-concat style. Slated for removal. */
    @SuppressWarnings("unchecked")
    public String renderLegacy(String templateId, Map<String, Object> data) {
        if ("order_confirmation_v1".equals(templateId)) {
            StringBuilder s = new StringBuilder();
            s.append("Hi ").append(data.get("name")).append(",\n\n");
            s.append("Order ").append(data.get("orderId"))
             .append(" confirmed. Total: $").append(data.get("total")).append("\n");
            s.append("Items:\n");
            var items = (java.util.List<String>) data.getOrDefault("items", java.util.List.of());
            for (String item : items) {
                s.append(" - ").append(item).append("\n");
            }
            return s.toString();
        }
        throw new IllegalArgumentException("legacy template missing: " + templateId);
    }
}
