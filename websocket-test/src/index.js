const SockJS = require('sockjs-client');
const { Stomp }  = require('@stomp/stompjs');

let stompClient = null;
const socket = new SockJS('http://localhost:8080/tasker');
const connect = () => {
    stompClient = Stomp.over(socket)
    stompClient.connect({}, frame => {
        console.log('Connected: ' + frame)

        /**
         * Подписка на получение всех задач из базы
         */
        stompClient.subscribe('/topic/tasks', response => {
            console.log('get tasks...', JSON.parse(response.body))
        });

        /**
         * Подписка на получение одной задачи
         */
        stompClient.subscribe('/topic/task', response => {
            console.log('get task...', JSON.parse(response.body))
        });

        /**
         * Подписка на получение оповещения об обновлении задачи
         */
        stompClient.subscribe('/topic/editing', response => {
            console.log('get editing...', response.body)
        });

         /**
         * Подписка на получение оповещения об удалении задачи
         */
        stompClient.subscribe('/topic/deleting', response => {
            console.log('get deleting...', JSON.parse(response.body))
        });
    })
}

const disconnect = () => {
    stompClient.disconnect();
}

const getTasks = () => {
    stompClient.send("/app/getTasks", {});
}

const getTask = (id) => {
    stompClient.send(`/app/${id}`, {}, id);
}

const addTask = (task) => {
    stompClient.send(`/app/addTask`, {}, JSON.stringify(task));
}

/**
 * @param {object} task 
 */
const updateTask = (taskRequest) => {
    stompClient.send(`/app/putTask`, {}, JSON.stringify(taskRequest));
}

//**Установка соединения */
connect();

/**Отложенный запуск на 3 сек */
setTimeout(() => {
    addTask({
        name: 'Купить молоко',
        description: 'Задача по покупке молока',
        createTask: new Date(),
        done: false    
    })
    /**Редактируем только созданную задачу купить молоко */
    updateTask(TaskUpdateRequest)
    getTasks();
    getTask(5);
}, 3000);

/**
 * Запрос на редактирование задачи
 */
const TaskUpdateRequest = {
    nameAsId: 'Купить молоко',
    task: {
        name: 'Купить молоко_edited',
        description: 'Задача по покупке молока, отредактированная тестом',
        createTask: new Date(),
        done: true
    }
}

/**Разрыв соединения через 10 сек */
setTimeout(() => {
    disconnect()
}, 10000)
