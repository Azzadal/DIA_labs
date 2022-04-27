import axios from "axios";
import { ITaskMutate } from "../types/types";


export const getTasks = async (): Promise<ITaskMutate[]> => {
    const { data } = await axios.get('http://localhost:8080/tasks');
    return data;
}

export const createTask = async (task: ITaskMutate) => {
    await axios.post('http://localhost:8080/tasks/addTask', task);
}

export const deleteTask = async (taskName: string) => {
    await axios.delete(`http://localhost:8080/tasks/${taskName}`);
    console.log(`task deleting... ${taskName}`)
}

export const editTask = async (taskName: string, task: ITaskMutate) => {
    await axios.put(`http://localhost:8080/tasks/edit_task/${taskName}`, task);
}
