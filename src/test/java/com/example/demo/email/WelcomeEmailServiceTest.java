package com.example.demo.email;

import com.example.demo.model.EmailResult;
import com.example.demo.model.User;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class WelcomeEmailServiceTest {

    private final TemplateEngine engine = new TemplateEngine();
    private final WelcomeEmailService service = new WelcomeEmailService(engine);

    @Test
    void sendWelcome_returnsCorrectRecipient() {
        User user = new User("u_1", "Ada", "ada@example.com");

        EmailResult result = service.sendWelcome(user);

        assertThat(result.to()).isEqualTo("ada@example.com");
    }

    @Test
    void sendWelcome_subjectContainsName() {
        User user = new User("u_1", "Ada", "ada@example.com");

        EmailResult result = service.sendWelcome(user);

        assertThat(result.subject()).isEqualTo("Welcome, Ada!");
    }

    @Test
    void sendWelcome_bodyLengthIsPositive() {
        User user = new User("u_1", "Ada", "ada@example.com");

        EmailResult result = service.sendWelcome(user);

        assertThat(result.bytes()).isGreaterThan(0);
    }
}
