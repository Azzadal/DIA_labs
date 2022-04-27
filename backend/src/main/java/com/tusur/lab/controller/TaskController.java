package com.tusur.lab.controller;

import com.tusur.lab.dto.object.TaskRequest;
import com.tusur.lab.model.Task;
import com.tusur.lab.service.TaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(value = "/tasks")
public class TaskController {
    private final TaskService taskService;
    private Logger logger = LoggerFactory.getLogger("TaskController");

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @MessageMapping("/getTasks")
    @SendTo("/topic/tasks")
    public Iterable<Task> getAll() {
        logger.info("Забрали все задачи из базы");
        return taskService.getAll();
    }

    @MessageMapping("/{id}")
    @SendTo("/topic/task")
    public Optional<Task> getTask(@PathVariable Integer id) {
        return taskService.getTask(id);
    }

    @MessageMapping("/addTask")
//    @SendTo("/topic/messages")
    public void addTask(@RequestBody Task taskReq) {
        logger.info("Кто-то добавил новую задачу с именем " + taskReq.getName());
        taskService.addTask(taskReq);
    }

    @MessageMapping("/putTask")
    @SendTo("/topic/editing")
    public String update(@RequestBody TaskRequest request){
        taskService.updateTask(request.getNameAsId(), request.getTask());
        return "Обновлена задача с именем " + request.getNameAsId();
    }

    @MessageMapping("/deleteTask")
    @SendTo("/topic/deleting")
    public String delete(@PathVariable String name) {
        taskService.deleteTask(name);
        return "Удалена задача с именем " + name;
    }
}
