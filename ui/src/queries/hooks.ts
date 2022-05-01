import { Client } from '@stomp/stompjs';
import { ITaskMutate } from '../types/types';

export const getTasks = (stompClient: Client) => {
  stompClient.publish({ destination: '/app/getTasks', body: '' });
};

export const createTask = (stompClient: Client, task: ITaskMutate) => {
  stompClient.publish({ destination: '/app/addTask', body: JSON.stringify(task) });
};

export const editTask = (stompClient: Client, taskRequest: any) => {
  stompClient.publish({ destination: '/app/putTask', body: JSON.stringify(taskRequest) });
};

export const deleteTask = (stompClient: Client, taskName: string) => {
  stompClient.publish({
    destination: `/app/deleteTask/${taskName}`,
    body: taskName,
  });
};
