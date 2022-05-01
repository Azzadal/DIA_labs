import { Button, Card, Input, Modal, Form } from 'antd';
import { useState } from 'react';
import { IAuthInfo } from '../types/types';
import { authservise, AuthResponse } from './authservice';

interface IAuthProps {
  onCancel: () => void;
  onSubmit: (info: IAuthInfo) => void;
}

interface IRegisterProps {
  onCancel: () => void;
  onSubmit: (info: IAuthInfo) => void;
}

interface ILoginProps {
  onSubmit: (token: AuthResponse) => void;
}

export const LoginPage: React.FC<ILoginProps> = ({ onSubmit }) => {
  const [choice, setChoice] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>();
  const authHandle = () => {
    setChoice('auth');
    setShowModal(true);
  };
  const registerHandle = () => {
    setChoice('reg');
    setShowModal(true);
  };

  const handleSubmit = async (info: IAuthInfo) => {
    choice === 'auth'
      ? onSubmit(await authservise.authorization(info))
      : await authservise.register(info);
  };

  return (
    <Card>
      <Button onClick={authHandle}>Вход</Button>
      <Button onClick={registerHandle}>Регистрация</Button>
      <Modal visible={showModal} footer={null}>
        {choice === 'auth' ? (
          <AuthPage onSubmit={handleSubmit} onCancel={() => setShowModal(false)} />
        ) : choice === 'reg' ? (
          <RegisterPage onSubmit={handleSubmit} onCancel={() => setShowModal(false)} />
        ) : (
          <strong>1</strong>
        )}
      </Modal>
    </Card>
  );
};

const AuthPage: React.FC<IAuthProps> = ({ onSubmit, onCancel }) => {
  const handleFinish = (info: IAuthInfo) => {
    onSubmit(info);
    onCancel();
  };
  return (
    <Card>
      <Form<IAuthInfo> onFinish={handleFinish}>
        <Form.Item
          name={'login'}
          style={{
            marginBottom: '.2rem',
          }}
          rules={[
            {
              required: true,
              message: 'Введите логин',
            },
          ]}
        >
          <Input placeholder="Логин" type={'text'} />
        </Form.Item>
        <Form.Item
          name={'password'}
          rules={[
            {
              required: true,
              message: 'Введите пароль',
            },
          ]}
        >
          <Input placeholder="Пароль" type={'password'} />
        </Form.Item>
        <Form.Item
          style={{
            textAlign: 'end',
          }}
        >
          <Button onClick={onCancel} type="default" htmlType="submit">
            Отмена
          </Button>
          <Button type="primary" htmlType="submit">
            Вход
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

const RegisterPage: React.FC<IRegisterProps> = ({ onSubmit, onCancel }) => {
  const handleFinish = (info: IAuthInfo) => {
    onSubmit(info);
    onCancel();
  };
  return (
    <Card>
      <Form<IAuthInfo> onFinish={handleFinish}>
        <Form.Item
          name={'login'}
          style={{
            marginBottom: '.2rem',
          }}
        >
          <Input placeholder="Логин" type={'text'} />
        </Form.Item>
        <Form.Item name={'password'}>
          <Input placeholder="Пароль" type={'password'} />
        </Form.Item>
        <Form.Item
          style={{
            textAlign: 'end',
          }}
        >
          <Button onClick={onCancel} type="default" htmlType="submit">
            Отмена
          </Button>
          <Button type="primary" htmlType="submit">
            Регистрация
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
