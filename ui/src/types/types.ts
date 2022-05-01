type response = { body: any };

export interface ITaskInfo {
  taskName: string;
  taskDescription: string;
  status: boolean;
  createTask: Date;
}

export interface ITaskMutate {
  id?: number;
  name: string;
  description: string;
  done: boolean;
  createTask: Date;
}

export interface IAuthInfo {
  login: string;
  password: string;
}

export interface IConnectProps {
  destination: string;
  cb: (response: response) => void;
}
