package com.tusur.lab.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    @Column(unique=true)
    private String name;
    private String description;
    private Boolean done;
    private Date createTask;

    public Task(String name) {
        this.name = name;
    }

    public Task(String name, String description, Boolean done, Date createTask) {
        this.name = name;
        this.description = description;
        this.done = done;
        this.createTask = createTask;
    }

    public Task(String name, Date createTask) {
        this.name = name;
        this.createTask = createTask;
    }

    public Task(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Task() {
    }
}
