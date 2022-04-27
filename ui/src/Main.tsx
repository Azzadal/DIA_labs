import React, { Fragment, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Tag, Card, Switch, Button, Modal } from 'antd';
import Table from './Table';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { CreateTask } from './CreateTask';
import { ColumnsType } from 'antd/lib/table/Table';
import EditTask from './EditTask';
import { createTask, deleteTask, editTask, getTasks } from './queries/hooks';
import { ITaskInfo } from './types/types';
import {
  mapTableRecordToTaskMutate,
  mapTaskInfoToTableRecord,
  mapTaskInfoToTaskMutate,
  mapTaskMutateToTaskInfo,
} from './utils/mapper';
import { authservise } from './auth/authservice';
import { LoginPage } from './auth/AuthPage';
import axios from 'axios';

interface ITableRecord extends ITaskInfo {
  key: string;
}

export const Main: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [editProp, setEditProp] = useState<ITableRecord>();
  const [data, setData] = useState<ITableRecord[]>();
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    console.log('token', token);
    queryTask();
  }, [token]);

  const queryTask = async () => {
    const data = await getTasks();
    setData(mapTaskInfoToTableRecord(mapTaskMutateToTaskInfo(data)));
  };

  const onChange = (checked: boolean, event: Event) => {
    console.log('Нажат switch', checked, event);
  };

  const handleCreateTask = async (taskInfo: ITaskInfo) => {
    const taskMutate = mapTaskInfoToTaskMutate(taskInfo);
    await createTask(taskMutate);
    setModalVisible(false);
    queryTask();
  };

  const columns: ColumnsType<ITableRecord> = [
    {
      title: 'Название',
      render: (_, data) => {
        return `${data.taskName}`;
      },
    },
    {
      title: 'Дата создания',
      render: (_, data) => {
        if (data.createTask) {
          return (
            <span>
              {`${new Date(data.createTask).toLocaleDateString()} 
                        ${new Date(data.createTask).toLocaleTimeString()}`}
            </span>
          );
        }
      },
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      render: (_, data) => (
        <Switch
          onChange={(checked, event) => onChange(checked, event)}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked={data.status}
        />
      ),
    },
    {
      title: 'Операция',
      dataIndex: 'operation',
      render: (_, data) => (
        <Button
          onClick={() => deleteTaskHandle(data.taskName)}
          style={{
            backgroundColor: '#C84954',
            borderRadius: '5px',
            color: 'whitesmoke',
          }}
        >
          Удалить
        </Button>
      ),
    },
  ];

  // обработчик удаления записи
  const deleteTaskHandle = async (taskName: string) => {
    setData(data?.filter((item) => item.taskName !== taskName));
    await deleteTask(taskName);
    queryTask();
  };

  // обработчик редактирования записи
  const onRowDblClickHandle = (record: ITableRecord, rI?: number) => {
    setEditProp(record);
    setModalEditVisible(true);
  };

  const editTaskHandle = async (record: ITableRecord) => {
    await editTask(
      record.taskName,
      mapTableRecordToTaskMutate({
        taskName: record.taskName,
        taskDescription: record.taskDescription,
        createTask: record.createTask,
        status: record.status,
      })
    );
    setModalEditVisible(false);
  };

  const testRequest = async () => {
    const token = localStorage.getItem('accessToken');
    const { data } = await axios.get('http://localhost:8080/admin/get', {
      headers: {
        Authorization: token ?? '',
      },
    });
    console.log(data);
    return data;
  };

  return (
    <Fragment>
      {token !== '' ? (
        <Card style={{ width: '80%', margin: '0 10%' }}>
          <Table<ITableRecord>
            dataSource={data}
            columns={columns}
            pagination={false}
            onRow={(record, rI) => ({
              onDoubleClick: () => {
                onRowDblClickHandle(record, rI);
              },
            })}
          />
          {editProp ? (
            <Modal footer={null} visible={modalEditVisible}>
              <EditTask taskRecord={editProp} onSubmit={editTaskHandle} />
            </Modal>
          ) : (
            ''
          )}
          <Button type={'primary'} onClick={() => setModalVisible(true)}>
            Создать задачу
          </Button>
          <Modal visible={modalVisible} footer={null}>
            <CreateTask onSubmit={handleCreateTask} />
          </Modal>
          <Button onClick={testRequest}>Тест</Button>
        </Card>
      ) : (
        <LoginPage onSubmit={(token) => setToken(token.token)} />
      )}
    </Fragment>
  );
};
