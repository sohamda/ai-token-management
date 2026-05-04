package com.example.demo;

import com.example.demo.api.OrderService;
import com.example.demo.api.UserService;
import com.example.demo.email.OrderConfirmationService;
import com.example.demo.email.WelcomeEmailService;
import com.example.demo.model.Order;
import com.example.demo.model.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;

import java.util.List;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Component
    static class DemoRunner implements CommandLineRunner {

        private final UserService userService;
        private final OrderService orderService;
        private final WelcomeEmailService welcomeEmailService;
        private final OrderConfirmationService orderConfirmationService;

        DemoRunner(UserService userService,
                   OrderService orderService,
                   WelcomeEmailService welcomeEmailService,
                   OrderConfirmationService orderConfirmationService) {
            this.userService = userService;
            this.orderService = orderService;
            this.welcomeEmailService = welcomeEmailService;
            this.orderConfirmationService = orderConfirmationService;
        }

        @Override
        public void run(String... args) {
            System.out.println("Demo app starting…");
            User user = userService.getUser("u_42");
            welcomeEmailService.sendWelcome(user);
            List<Order> orders = orderService.listOrders(user.id());
            for (Order o : orders) {
                orderConfirmationService.sendOrderConfirmation(user, o);
            }
        }
    }
}
