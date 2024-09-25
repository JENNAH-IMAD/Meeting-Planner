import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Select, Form, Input, message } from 'antd';
import { getAllReservations, updateReservation, deleteReservation } from '../../services/Reservation';
import { getAllRooms } from '../../services/RoomService';
import { getAllUsers } from '../../services/UserService';
import { DatePicker, TimePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { confirm } = Modal;

const ListReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    fetchReservations();
    fetchRooms();
    fetchUsers();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await getAllReservations();
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await getAllRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const showUpdateModal = (reservation) => {
    setSelectedReservation(reservation);
    setVisible(true);
    form.setFieldsValue({
      title: reservation.title,
      dateMeeting: moment(reservation.dateMeeting),
      timeMeetingStart: moment(reservation.timeMeetingStart, 'HH:mm'),
      timeMeetingEnd: moment(reservation.timeMeetingEnd, 'HH:mm'),
      createdBy: reservation.createdBy,
      room: reservation.room,
      description: reservation.description,
    });
  };

  const handleCancel = () => {
    form.resetFields(); // Reset form fields
    setVisible(false);
  };

  const handleUpdate = async (values) => {
    const { title, dateMeeting, timeMeetingStart, timeMeetingEnd, createdBy, room, description } = values;
  
    // Check for empty fields
    if (!title || !dateMeeting || !timeMeetingStart || !timeMeetingEnd || !createdBy || !room || !description) {
      message.error('Please fill in all required fields.');
      return;
    }
  
    const formattedDateMeeting = dateMeeting.format('YYYY-MM-DD');
    const formattedTimeMeetingStart = timeMeetingStart.format('HH:mm');
    const formattedTimeMeetingEnd = timeMeetingEnd.format('HH:mm');
  
    // Check if the user has already reserved another room for the same time range on the same date
    const userReservations = reservations.filter(reservation => reservation.createdBy === createdBy);
    const conflictingUserReservation = userReservations.find(reservation => {
      const reservationStartDate = moment(reservation.dateMeeting).format('YYYY-MM-DD');
      const reservationStartTime = moment(reservation.timeMeetingStart, 'HH:mm').format('HH:mm');
      const reservationEndTime = moment(reservation.timeMeetingEnd, 'HH:mm').format('HH:mm');
      return reservationStartDate === formattedDateMeeting &&
             ((formattedTimeMeetingStart >= reservationStartTime && formattedTimeMeetingStart < reservationEndTime) ||
             (formattedTimeMeetingEnd > reservationStartTime && formattedTimeMeetingEnd <= reservationEndTime));
    });
  
    if (conflictingUserReservation) {
      message.error('You have already reserved another room for the same time range on the same date.');
      return;
    }
  
    // Check if room is already reserved for the selected date and time range
    const roomReservations = reservations.filter(reservation => reservation.room === room);
    const conflictingRoomReservation = roomReservations.find(reservation => {
      const reservationStartDate = moment(reservation.dateMeeting).format('YYYY-MM-DD');
      const reservationStartTime = moment(reservation.timeMeetingStart, 'HH:mm').format('HH:mm');
      const reservationEndTime = moment(reservation.timeMeetingEnd, 'HH:mm').format('HH:mm');
      return reservationStartDate === formattedDateMeeting &&
             ((formattedTimeMeetingStart >= reservationStartTime && formattedTimeMeetingStart < reservationEndTime) ||
             (formattedTimeMeetingEnd > reservationStartTime && formattedTimeMeetingEnd <= reservationEndTime));
    });
  
    if (conflictingRoomReservation) {
      message.error('The room is already reserved for the selected date and time range.');
      return;
    }
  
    try {
      await updateReservation(selectedReservation.id, {
        title,
        dateMeeting: formattedDateMeeting,
        timeMeetingStart: formattedTimeMeetingStart,
        timeMeetingEnd: formattedTimeMeetingEnd,
        createdBy,
        room,
        description,
      });
      fetchReservations();
      setVisible(false);
      message.success('Reservation updated successfully!');
    } catch (error) {
      console.error('Error updating reservation:', error);
      message.error('An error occurred while updating reservation. Please try again later.');
    }
  };
  const showDeleteConfirm = (reservationId) => {
    confirm({
      title: 'Are you sure you want to delete this reservation?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteReservation(reservationId)
          .then(() => {
            fetchReservations();
            message.success('Reservation deleted successfully!');
          })
          .catch(error => {
            console.error('Error deleting reservation:', error);
            message.error('An error occurred while deleting reservation. Please try again later.');
          });
      },
    });
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Date Meeting',
      dataIndex: 'dateMeeting',
      key: 'dateMeeting',
    },
    {
      title: 'Time Meeting Start',
      dataIndex: 'timeMeetingStart',
      key: 'timeMeetingStart',
    },
    {
      title: 'Time Meeting End',
      dataIndex: 'timeMeetingEnd',
      key: 'timeMeetingEnd',
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Room',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" onClick={() => showUpdateModal(record)}>Update</Button>
          <Button type="danger" style={{ color: 'white', background: '#D23232' }} onClick={() => showDeleteConfirm(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ margin: 'auto', width: '80%', padding: '20px', boxShadow: '20px 20px 20px 20px #858280', borderRadius: '30px', marginTop: '40px', }}>
      <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>List of Reservations</h1>
      <Table columns={columns} dataSource={reservations} bordered={true} />

      <Modal
        title="Update Reservation"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleUpdate}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter the title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Date Meeting"
            name="dateMeeting"
            rules={[{ required: true, message: 'Please select the date meeting!' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="Time Meeting Start"
            name="timeMeetingStart"
            rules={[{ required: true, message: 'Please select the time meeting start!' }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            label="Time Meeting End"
            name="timeMeetingEnd"
            rules={[{ required: true, message: 'Please select the time meeting end!' }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            label="Room"
            name="room"
            rules={[{ required: true, message: 'Please select the room!' }]}
          >
              <Select>
                {rooms.map(room => (
                  <Option key={room.id} value={`${room.name} - ${room.typeofRoom}`}>
                    {`${room.name} - ${room.typeofRoom}`}
                  </Option>
                ))}
              </Select>
          </Form.Item>
          <Form.Item
            label="Created By"
            name="createdBy"
            rules={[{ required: true, message: 'Please select the creator!' }]}
          >
            <Select>
              {users.map(user => (
                <Option key={user.id} value={user.name}>{user.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter the description!' }]}
          >
            <Input.TextArea />
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

export default ListReservation;
