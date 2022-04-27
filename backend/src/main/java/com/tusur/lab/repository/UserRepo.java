package com.tusur.lab.repository;

import com.tusur.lab.model.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepo extends CrudRepository<User, Long> {
    User findByLogin(String login);
}
