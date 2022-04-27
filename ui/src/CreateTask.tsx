import React from "react";
import { Button, Card, Form, Input } from "antd"
import { ITaskInfo } from "./types/types";

interface ICreateTaskProps {
    onSubmit: (task: ITaskInfo) => void;
}

export const CreateTask:React.FC<ICreateTaskProps> = ({ onSubmit }) => {

    const submitHandle = (param: ITaskInfo) => {
        param.createTask = new Date();
        onSubmit(param);
    }
    return (
        <Card>
            <Form onFinish={submitHandle}>
                <Form.Item 
                    name={"taskName"}
                    label={"Название задачи"}
                    >
                    <Input />
                </Form.Item>
                <Form.Item 
                    name={"taskDescription"}
                    label={"Описание задачи"}
                >
                    <Input />
                </Form.Item>
                <Form.Item style={{textAlign:"end"}}>
                    <Button type="primary" htmlType="submit">
                        Создать
                    </Button>
                </Form.Item>    
            </Form>
        </Card>
    )
}