// Login.js
import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginAPICall, saveLoggedInUser, storeToken } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigator = useNavigate();
    const [form] = Form.useForm();

    const handleLoginForm = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await loginAPICall(username, password);
            console.log(response.data);

            const token = 'Bearer ' + response.data.accessToken;
            const role = response.data.role;

            storeToken(token);
            saveLoggedInUser(username, role);
            navigator("/ListUser");
        } catch (error) {
            console.error(error);
        }

        setLoading(false);
    };

    const handleClearForm = () => {
        form.resetFields();
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 'auto', width: '30%', padding: '20px', boxShadow: '20px 20px 20px 20px #858280', borderRadius: '30px', marginTop: '40px' }}>
            <Card style={{ width: 400 }}>
                <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Login</h1>
                <Form
                    form={form}
                    name="login"
                    initialValues={{ remember: true }}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input value={username} onChange={(e) => setUsername(e.target.value)} prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button onClick={handleLoginForm} type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                            Log in
                        </Button>
                        <Button type="default" onClick={handleClearForm} style={{ width: '100%', marginTop: '10px' }}>
                            Clear
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
