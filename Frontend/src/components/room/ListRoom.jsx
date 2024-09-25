import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Select, Form, Input, message } from 'antd';
import { getAllRooms, updateRoom, deleteRoom } from '../../services/RoomService';
import { isAdminUser } from '../../services/AuthService';

const { Option } = Select;
const { confirm } = Modal;

const ListRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const isAdmin = isAdminUser();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await getAllRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const showUpdateModal = (room) => {
    setSelectedRoom(room);
    setVisible(true);
    form.setFieldsValue({
      name: room.name,
      typeofRoom: room.typeofRoom,
      capacity: room.capacity,
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleUpdate = async (values) => {
    const { name, typeofRoom, capacity } = values;

    console.log('Updating room with values:', values); // Add this line for debugging

    // Check if any required field is empty
    if (!name || !typeofRoom || !capacity) {
      message.error('Please fill in all required fields.');
      return;
    }

    // Check if the updated name and type of room are unique
    const isNameTypeUnique = rooms.every(room => {
      return room.id === selectedRoom.id || (room.name !== name || room.typeofRoom !== typeofRoom);
    });

    if (!isNameTypeUnique) {
      message.error('A room with the same name and type already exists.');
      return;
    }

    try {
      // Proceed with updating room
      await updateRoom(selectedRoom.id, values);

      // Refresh rooms after successful update
      fetchRooms();

      setVisible(false);
      message.success('Room updated successfully!');
    } catch (error) {
      console.error('Error updating room:', error);
      message.error('An error occurred while updating room. Please try again later.');
    }
  };

  const showDeleteConfirm = (roomId) => {
    confirm({
      title: 'Are you sure you want to delete this room?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteRoom(roomId)
          .then(() => {
            // Refresh rooms after successful deletion
            fetchRooms();
            message.success('Room deleted successfully!');
          })
          .catch(error => {
            console.error('Error deleting room:', error);
            message.error('An error occurred while deleting room. Please try again later.');
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
      title: 'Type of Room',
      dataIndex: 'typeofRoom',
      key: 'typeofRoom',
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {isAdmin && <Button type="primary" onClick={() => showUpdateModal(record)}>Update</Button>}
          {isAdmin && <Button type="danger" style={{color: 'white', background:'#D23232'}} className="delete-button" onClick={() => showDeleteConfirm(record.id)}>Delete</Button>}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ margin: 'auto', width: '60%', padding: '20px',  boxShadow: '20px 20px 20px 20px #858280', borderRadius: '30px', marginTop: '40px',}}>
      <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>List of Rooms</h1>
      <Table columns={columns} dataSource={rooms} bordered={true} />

      <Modal
        title="Update Room"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          bordered={true}
          onFinish={handleUpdate}
        >
          <Form.Item
            label="Room Name"
            name="name"
            rules={[{ message: 'Please enter the room name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Type of Room"
            name="typeofRoom"
            rules={[{ message: 'Please select the type of room!' }]}
          >
            <Select>
              <Option value="Conference room">Conference room</Option>
              <Option value="Boardroom">Boardroom</Option>
              <Option value="Meeting room">Meeting room</Option>
              <Option value="Training room">Training room</Option>
              <Option value="Presentation room">Presentation room</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Capacity"
            name="capacity"
            rules={[{ message: 'Please enter the room capacity!' }]}
          >
            <Input type="number" />
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

export default ListRooms;
