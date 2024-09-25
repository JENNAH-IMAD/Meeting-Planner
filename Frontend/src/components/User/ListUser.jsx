import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { getAllUsers, updateUser, deleteUser } from '../../services/UserService';
import { isAdminUser } from '../../services/AuthService';

const { confirm } = Modal;
const { Option } = Select;

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedUser, setSelectedUser] = useState(null);
  
  const isAdmin = isAdminUser();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const showUpdateModal = (user) => {
    setSelectedUser(user);
    setVisible(true);
    form.setFieldsValue({
      name: user.name,
      username: user.username,
      email: user.email,
      post: user.post,
      team: user.team,
      role: user.role.name
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleUpdate = async (values) => {
    const { name, username, email, role } = values;

    // Check if any required field is empty
    if (!name || !username || !email || !role) {
      message.error('Please fill in all required fields.');
      return;
    }

    // Check if a user with the same username and email already exists
    const isDuplicateUser = users.some(user => user.id !== selectedUser.id && (user.username === username || user.email === email));
    if (isDuplicateUser) {
      message.error('A user with the same username or email already exists.');
      return;
    }

    try {
      await updateUser(selectedUser.id, values);
      fetchUsers();
      setVisible(false);
      message.success('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('An error occurred while updating user. Please try again later.');
    }
  };

  const showDeleteConfirm = (userId) => {
    confirm({
      title: 'Are you sure you want to delete this user?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteUser(userId)
          .then(() => {
            fetchUsers();
            message.success('User deleted successfully!');
          })
          .catch(error => {
            console.error('Error deleting user:', error);
            message.error('An error occurred while deleting user. Please try again later.');
          });
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Post',
      dataIndex: 'post',
      key: 'post',
    },
    {
      title: 'Team',
      dataIndex: 'team',
      key: 'team',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {isAdmin && <Button type="primary" onClick={() => showUpdateModal(record)}>Update</Button>}
          {isAdmin && <Button type="danger" style={{color: 'white', background:'#D23232'}} onClick={() => showDeleteConfirm(record.id)}>Delete</Button>}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ margin: 'auto', width: '90%', padding: '20px', boxShadow: '20px 20px 20px 20px #858280', borderRadius: '30px', marginTop: '40px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>List of Users</h1>
      <Table columns={columns} dataSource={users} bordered />

      <Modal
        title="Update User"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleUpdate}
        >
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
            rules={[{ required: true, message: 'Please select the role!' }]}
          >
            <Select>
            <Option value="ROLE_ADMIN">Admin</Option>
            <Option value="ROLE_USER">User</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ListUser;
