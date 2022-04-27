export interface ITaskInfo {
  taskName: string;
  taskDescription: string;
  status: boolean;
  createTask: Date;
}

export interface ITaskMutate {
  name: string;
  description: string;
  done: boolean;
  createTask: Date;
}

export interface IAuthInfo {
  login: string;
  password: string;
}
