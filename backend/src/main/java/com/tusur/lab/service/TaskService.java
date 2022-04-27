package com.tusur.lab.service;

import com.tusur.lab.model.Task;
import com.tusur.lab.repository.TaskRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Iterable<Task> getAll() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTask(Integer id) {
        return taskRepository.findById(id);
    }

    public void addTask(Task task) {
        taskRepository.save(task);
    }

    public void updateTask(String name, Task task) {
        Task taskFromDb = taskRepository.findByName(name);
        BeanUtils.copyProperties(task, taskFromDb, "id", "name");
        taskRepository.save(taskFromDb);
    }

    public void deleteTask(String name) {
        Task taskFromDb = taskRepository.findByName(name);
        System.out.println(taskFromDb.getName());
        taskRepository.deleteById(taskFromDb.getId());
    }
}
