package com.example.demo.api;

import com.example.demo.model.User;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserServiceTest {

    private final UserService userService = new UserService();

    @Test
    void getUser_returnsUserWithGivenId() {
        User user = userService.getUser("u_42");

        assertThat(user.id()).isEqualTo("u_42");
        assertThat(user.name()).isEqualTo("Ada Lovelace");
        assertThat(user.email()).isEqualTo("ada@example.com");
    }

    @Test
    void getUser_preservesDifferentIds() {
        User user = userService.getUser("u_99");

        assertThat(user.id()).isEqualTo("u_99");
    }
}
