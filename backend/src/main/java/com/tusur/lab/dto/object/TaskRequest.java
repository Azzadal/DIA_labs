package com.tusur.lab.dto.object;

import com.tusur.lab.model.Task;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TaskRequest {
    String nameAsId;
    Task task;
}
