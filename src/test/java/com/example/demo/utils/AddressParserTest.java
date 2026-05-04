package com.example.demo.utils;

import com.example.demo.model.Address;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AddressParserTest {

    @Test
    void parseAddress_validFourParts() {
        Address addr = AddressParser.parseAddress("221B Baker Street, London, NW1 6XE, UK");

        assertThat(addr.street()).isEqualTo("221B Baker Street");
        assertThat(addr.city()).isEqualTo("London");
        assertThat(addr.postalCode()).isEqualTo("NW1 6XE");
        assertThat(addr.country()).isEqualTo("UK");
    }

    @Test
    void parseAddress_trimsWhitespace() {
        Address addr = AddressParser.parseAddress("  Main St ,  NYC , 10001 , US ");

        assertThat(addr.street()).isEqualTo("Main St");
        assertThat(addr.city()).isEqualTo("NYC");
    }

    @Test
    void parseAddress_nullInputThrows() {
        assertThatThrownBy(() -> AddressParser.parseAddress(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("address must be a string");
    }

    @Test
    void parseAddress_tooFewPartsThrows() {
        assertThatThrownBy(() -> AddressParser.parseAddress("one, two"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("address requires street, city, postal, country");
    }
}
