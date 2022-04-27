import { getTasks } from "../queries/hooks";
import { ITaskInfo, ITaskMutate } from "../types/types";

export function mapTaskMutateToTaskInfo(taskMutate: ITaskMutate[]): ITaskInfo[] {
    return taskMutate.map(task => {
        return {
            taskName: task.name,
            taskDescription: task.description,
            status: task.done,
            createTask: task.createTask
        }
    })
}

export function mapTaskInfoToTaskMutate(taskInfo: ITaskInfo): ITaskMutate {
    return {
        name: taskInfo.taskName,
        description: taskInfo.taskDescription,
        done: taskInfo.status,
        createTask: taskInfo.createTask
    }
}

export function mapTaskInfoToTableRecord(taskInfo: ITaskInfo[]) {
    return taskInfo.map(task => {
        return {
            key: `${task.taskName}_${task.createTask}`,
            ...task
        }
    })
}

export function mapTableRecordToTaskMutate(record: ({key?: string} & ITaskInfo)): ITaskMutate {
    return {
        name: record.taskName,
        description: record.taskDescription,
        createTask: record.createTask,
        done: record.status
    }
}