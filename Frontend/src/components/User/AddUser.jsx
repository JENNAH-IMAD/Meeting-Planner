import { useState } from 'react';
import { saveUser, getAllUsers } from '../../services/UserService';
import { Form, Input, Select, Button, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddUser = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    

    const onFinish = async (values) => {
        setLoading(true);
        const user = {
            name: values.name,
            username: values.username,
            email: values.email,
            password: values.password,
            post: values.post,
            team: values.team,
            role: values.role
        };

        // Check if any required field is empty
        if (!values.name || !values.username || !values.email || !values.password || !values.role) {
            message.error('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        // Check if a user with the same username and email already exists
        const existingUserResponse = await getAllUsers();
        const existingUsers = existingUserResponse.data;
        if (existingUsers.some(existingUser => existingUser.username === user.username || existingUser.email === user.email)) {
            message.error('A user with the same username or email already exists.');
            setLoading(false);
            return;
        }

        // Save user if validation passes
        saveUser(user)
            .then(() => {
                setLoading(false);
                navigate('/ListUser');
                message.success('User added successfully!');
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
                message.error('An error occurred while adding the user. Please try again later.');
            });
    };

    const handleClear = () => {
        form.resetFields();
    };

    return (
        <div style={{ margin: 'auto', width: '60%', padding: '20px', boxShadow: '10px 10px 10px 10px #858280', borderRadius: '30px', marginTop: '30px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.8rem' }}>Create User</h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please enter the name!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please enter the username!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please enter the email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please enter the password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label="Post"
                            name="post"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Team"
                            name="team"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Role"
                            name="role"
                            rules={[{ required: true, message: 'Please select at least one role!' }]}
                        >
                            <Select>
                                <Option value="ROLE_ADMIN">Admin</Option>
                                <Option value="ROLE_USER">User</Option>
                                {/* Add more options if needed */}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <div style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: '10px' }}>
                        Create User
                    </Button>
                    <Button onClick={handleClear}>
                        Clear
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default AddUser;
