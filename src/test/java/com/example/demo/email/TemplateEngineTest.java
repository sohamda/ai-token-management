package com.example.demo.email;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class TemplateEngineTest {

    private final TemplateEngine engine = new TemplateEngine();

    @Test
    void render_welcomeTemplate() {
        String result = engine.render("welcome", Map.of("name", "Ada"));

        assertThat(result).isEqualTo("Hi Ada, welcome to the demo!");
    }

    @Test
    void render_orderConfirmationV2() {
        String result = engine.render("order_confirmation_v2", Map.of(
                "name", "Ada", "orderId", "o_1", "total", 49.5
        ));

        assertThat(result).contains("Ada").contains("o_1").contains("49.5");
    }

    @Test
    void render_unknownTemplateThrows() {
        assertThatThrownBy(() -> engine.render("nope", Map.of()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Unknown template: nope");
    }

    @Test
    void renderLegacy_orderConfirmationV1() {
        String result = engine.renderLegacy("order_confirmation_v1", Map.of(
                "name", "Ada",
                "orderId", "o_1",
                "total", 49.5,
                "items", List.of("Mug", "Sticker")
        ));

        assertThat(result).contains("Hi Ada");
        assertThat(result).contains("Order o_1 confirmed");
        assertThat(result).contains(" - Mug\n");
        assertThat(result).contains(" - Sticker\n");
    }

    @Test
    void renderLegacy_unknownTemplateThrows() {
        assertThatThrownBy(() -> engine.renderLegacy("bad", Map.of()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("legacy template missing: bad");
    }
}
