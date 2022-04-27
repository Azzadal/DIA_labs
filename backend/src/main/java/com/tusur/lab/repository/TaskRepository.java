package com.tusur.lab.repository;

import com.tusur.lab.model.Task;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends CrudRepository<Task, Integer> {
    Task findByName(String name);
}
