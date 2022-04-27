import React from "react";
import { Tag, Card } from 'antd';

interface ITask {
    name: string;
    decsription: string;
    done: boolean;
    createTask: Date;
}
 
const Task:React.FC<ITask> = ({ ...props }) => {
    return (
        <Card>
            
        </Card>
    )
}