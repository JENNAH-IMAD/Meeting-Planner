import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, TimePicker, Select, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getAllReservations, saveReservation } from '../../services/Reservation';
import { getAllUsers } from '../../services/UserService';
import { getAllRooms } from '../../services/RoomService';
import { getLoggedInUser } from '../../services/AuthService';

const { Option } = Select;

const AddReservation = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, roomsData,reservationsData] = await Promise.all([
          getAllUsers(),
          getAllRooms(),
          getAllReservations()
        ]);

        setUsers(usersData.data); // Assuming usersData is an object with a 'data' property containing the array of users
        setRooms(roomsData.data); // Assuming roomsData is an object with a 'data' property containing the array of rooms
        setReservations(reservationsData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = {
        ...values,
        dateMeeting: values.dateMeeting.format('YYYY-MM-DD'),
        timeMeetingStart: values.timeMeetingStart.format('HH:mm'),
        timeMeetingEnd: values.timeMeetingEnd.format('HH:mm'),
        createdBy: getLoggedInUser()
      };

      // Add validation checks here if needed

      const response = await saveReservation(formData);
      message.success('Reservation created successfully!');
      navigate('/ListReservation');
      form.resetFields();
    } catch (error) {
      console.error('Error creating reservation:', error);
      message.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    form.resetFields();
  };

  return (
    <div style={{ margin: 'auto', width: '40%', padding: '20px', boxShadow: '20px 20px 20px 20px #858280', borderRadius: '30px', marginTop: '40px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Create Reservation</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please enter the title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Date"
              name="dateMeeting"
              rules={[{ required: true, message: 'Please select the date!' }]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              label="Start Time"
              name="timeMeetingStart"
              rules={[{ required: true, message: 'Please select the start time!' }]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>
            <Form.Item
              label="End Time"
              name="timeMeetingEnd"
              rules={[{ required: true, message: 'Please select the end time!' }]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>
          </Col>
          <Col span={12}>
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
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please enter the description!' }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="createdBy"
              initialValue={getLoggedInUser()}
              rules={[{ required: true, message: 'Please select the creator!' }]}
            >
            </Form.Item>
          </Col>
        </Row>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Reservation
          </Button>
          <Button style={{ marginLeft: '10px' }} onClick={handleClear}>
            Clear
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddReservation;
