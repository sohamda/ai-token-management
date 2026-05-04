package com.example.demo.utils;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class FormatUtilsTest {

    @Test
    void formatMoney_defaultUSD() {
        String result = FormatUtils.formatMoney(49.50);

        assertThat(result).isEqualTo("$49.50");
    }

    @Test
    void formatMoney_explicitCurrency() {
        String result = FormatUtils.formatMoney(120.00, "USD");

        assertThat(result).isEqualTo("$120.00");
    }

    @Test
    void pluralize_singularWhenOne() {
        assertThat(FormatUtils.pluralize(1, "item")).isEqualTo("item");
    }

    @Test
    void pluralize_defaultPluralSuffix() {
        assertThat(FormatUtils.pluralize(2, "item")).isEqualTo("items");
    }

    @Test
    void pluralize_customPlural() {
        assertThat(FormatUtils.pluralize(0, "person", "people")).isEqualTo("people");
    }
}
