package com.example.demo.api;

import com.example.demo.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public User getUser(String id) {
        return new User(id, "Ada Lovelace", "ada@example.com");
    }
}
