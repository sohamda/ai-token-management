package com.example.demo.email;

import com.example.demo.model.EmailResult;
import com.example.demo.model.User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class WelcomeEmailService {

    private final TemplateEngine templateEngine;

    public WelcomeEmailService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public EmailResult sendWelcome(User user) {
        String subject = "Welcome, " + user.name() + "!";
        String body = templateEngine.render("welcome", Map.of("name", user.name()));
        return new EmailResult(user.email(), subject, body.length());
    }
}
