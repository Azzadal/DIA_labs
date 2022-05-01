import React, { Fragment, useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Card, Switch, Button, Modal } from 'antd';
import Table from './Table';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { CreateTask } from './CreateTask';
import { ColumnsType } from 'antd/lib/table/Table';
import EditTask from './EditTask';
import { createTask, deleteTask, editTask, getTasks } from './queries/hooks';
import { IConnectProps, ITaskInfo } from './types/types';
import {
  mapTaskInfoToTableRecord,
  mapTaskInfoToTaskMutate,
  mapTaskMutateToTaskInfo,
} from './utils/mapper';
import { LoginPage } from './auth/AuthPage';
import axios from 'axios';
import { webSocketClient } from './web-socket';
import { Client } from '@stomp/stompjs';

interface ITableRecord extends ITaskInfo {
  key: string;
}

export const Main: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [editProp, setEditProp] = useState<ITableRecord>();
  const [objData, setData] = useState<ITableRecord[]>([]);
  const [token, setToken] = useState<string>('');
  const [client, setClient] = useState<Client>(new Client());

  const ws = webSocketClient('ws://localhost:8080/tasker');

  useEffect(() => {
    setClient(ws.client);
    ws.connect();
  }, []);

  client.onConnect = (frame) => {
    subscriber.forEach((prop) => {
      client.subscribe(prop.destination, prop.cb);
    });

    client.publish({ destination: '/app/getTasks' });
  };

  const subscriber: IConnectProps[] = [
    /**
     * Подписка на получение всех задач из базы
     */
    {
      destination: '/topic/tasks',
      cb: (response) => {
        console.log('get tasks...', JSON.parse(response.body));
        setData(
          mapTaskInfoToTableRecord(mapTaskMutateToTaskInfo(JSON.parse(response.body)))
        );
      },
    },
    /**
     * Подписка на получение одной задачи
     */
    {
      destination: '/topic/task',
      cb: (response) => {
        console.log('get task...', JSON.parse(response.body));
      },
    },
    /**
     * Подписка на получение информации о создании задачи
     */
    {
      destination: '/topic/create',
      cb: (response) => {
        queryTask();
        console.log('create task...', response.body);
      },
    },
    /**
     * Подписка на получение оповещения об обновлении задачи
     */
    {
      destination: '/topic/editing',
      cb: (response) => {
        queryTask();
        console.log('editing...', response.body);
      },
    },
    /**
     * Подписка на получение оповещения об удалении задачи
     */
    {
      destination: '/topic/deleting',
      cb: (response) => {
        queryTask();
        console.log('deleting...', response.body);
      },
    },
  ];

  const queryTask = () => {
    getTasks(client);
  };

  const onChange = (checked: boolean, event: Event) => {
    console.log('Нажат switch', checked, event);
  };

  const handleCreateTask = (taskInfo: ITaskInfo) => {
    const taskMutate = mapTaskInfoToTaskMutate(taskInfo);
    createTask(client, taskMutate);
    setModalVisible(false);
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
  const deleteTaskHandle = (taskName: string) => {
    setData(objData?.filter((item) => item.taskName !== taskName));
    deleteTask(client, taskName);
  };

  // обработчик редактирования записи
  const onRowDblClickHandle = (record: ITableRecord, rI?: number) => {
    setEditProp(record);
    setModalEditVisible(true);
  };

  const editTaskHandle = async (record: ITableRecord) => {
    editTask(client, {
      nameAsId: record.taskName,
      task: {
        name: record.taskName,
        description: record.taskDescription,
        createTask: record.createTask,
        done: record.status,
      },
    });
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
            dataSource={objData}
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
