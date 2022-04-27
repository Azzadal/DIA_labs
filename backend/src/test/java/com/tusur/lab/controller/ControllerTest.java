package com.tusur.lab.controller;

import com.tusur.lab.model.Task;
import com.tusur.lab.repository.TaskRepository;
import com.tusur.lab.service.TaskService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class ControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private TaskRepository taskRepository;


    private Task createNewTask(String name) {
        Task task = new Task(name);
        return taskRepository.save(task);
    }

    @Test
    public void getAll() throws Exception {
        this.mockMvc.perform(get("/tasks"))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    public void getOne() throws Exception {
        this.mockMvc.perform(get("/tasks/17"))
            .andDo(print())
            .andExpect(status().isOk());
    }

    @Test
    public void postTest() throws Exception {
       this.mockMvc.perform(post("/tasks/addTask")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"name\":\"Купить молоко\",\"description\":\"Задание по покупке молока\"," +
                    "\"description\":\"Задание по покупке молока\",\"createTask\":\"2021-12-18\"}"))
            .andDo(print());
    }

    @Test
    public void putTest() throws Exception {
        this.mockMvc.perform(put("/tasks/edit_task/17").contentType(MediaType.APPLICATION_JSON).content(
                "{\"createTask\":\"2020-12-18\"}"
        ))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    public void deleteTest() throws Exception {
        this.mockMvc.perform(delete("/tasks/17"))
                .andDo(print())
                .andExpect(status().isOk());
    }
}
