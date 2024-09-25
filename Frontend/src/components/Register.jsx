import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { registerAPICall } from '../services/AuthService';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RiTeamLine } from "react-icons/ri";
import { BiSolidUserBadge } from "react-icons/bi";


const Register = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const register = {
                name: values.name,
                username: values.username,
                email: values.email,
                password: values.password,
                post: values.post, // Added post field
                team: values.team, // Added team field
            };
            console.log(register);
            const response = await registerAPICall(register);
            console.log(response.data);
            // You can add any success handling here, like displaying a success message
            form.resetFields(); // Reset form fields after successful registration
            navigator("/login");
        } catch (error) {
            console.error(error);
            // Handle registration error
        }
        setLoading(false);
    };

    const handleClearForm = () => {
        form.resetFields(); // Reset form fields
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '80vh', background: '#f0f2f5', paddingBottom: '60px', alignItems: 'center' }}>
            <div style={{ width: '25%', padding: '10px', boxShadow: '20px 20px 20px 20px #858280', borderRadius: '30px', marginTop: '40px' }}>
                <Card>
                    <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '24px', fontWeight: 'bold' }}>Sign Up</h1>
                    <Form
                        form={form}
                        name="register"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Name" style={{ borderRadius: '8px' }} />
                        </Form.Item>

                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Username" style={{ borderRadius: '8px' }} />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Please enter a valid email!' }
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="Email" style={{ borderRadius: '8px' }} />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" style={{ borderRadius: '8px' }} />
                        </Form.Item>

                        <Form.Item
                            name="post"
                            rules={[{ required: true, message: 'Please input your post!' }]}
                        >
                            <Input prefix={<BiSolidUserBadge  />} placeholder="Post" style={{ borderRadius: '8px' }} />
                        </Form.Item>

                        <Form.Item
                            name="team"
                            rules={[{ required: true, message: 'Please input your team!' }]}
                        >
                            <Input prefix={<RiTeamLine  />} placeholder="Team" style={{ borderRadius: '8px' }} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }}>
                                Register
                            </Button>
                            <Button type="default" onClick={handleClearForm} style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }}>
                                Clear
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Register;
