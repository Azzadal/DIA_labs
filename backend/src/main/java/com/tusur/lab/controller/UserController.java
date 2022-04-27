package com.tusur.lab.controller;

import com.tusur.lab.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user/get")
    public String getUser()
    {
        return "Hi user";
    }

    @GetMapping("/admin/get")
    public String getAdmin()
    {
        return "Hi admin";
    }
}
