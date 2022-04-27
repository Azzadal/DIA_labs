import { Button, Card, Form, Input } from "antd";
import React from "react";
import { ITaskInfo } from "./types/types";

interface IEditTaskProps {
    taskRecord: {key: string} & ITaskInfo;
    onSubmit: (task: ({key: string} & ITaskInfo)) => void;
}

const EditTask:React.FC<IEditTaskProps> = ({ taskRecord, onSubmit }) => {
    
    const submitHandle = (task: any) => {
        taskRecord.taskDescription = task.taskDescription;
        onSubmit(taskRecord);
    }

    return (
        <Card>   
            <div>Редактирование задачи</div>
            <div><b>{taskRecord.taskName}</b></div><br/>
            <Form onFinish={submitHandle}>
                <Form.Item name={"taskDescription"} label={"Описание"}>
                    <Input />
                </Form.Item>
            <Form.Item style={{textAlign:"end"}}>
                <Button type="primary" htmlType="submit">
                    Сохранить
                </Button>
            </Form.Item>    
            </Form>
        </Card>
    )
}

export default EditTask;