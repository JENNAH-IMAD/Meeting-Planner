import { useState } from 'react';
import { saveRoom, getAllRooms } from '../../services/RoomService';
import { Form, Input, Select, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddRoom = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        const room = {
            name: values.name,
            typeofRoom: values.typeofRoom,
            capacity: parseInt(values.capacity)
        };

        // Check if a room with the same name and type already exists
        try {
            const existingRoomsResponse = await getAllRooms();
            const existingRooms = existingRoomsResponse.data;
            if (existingRooms.some(existingRoom => existingRoom.name === room.name && existingRoom.typeofRoom === room.typeofRoom)) {
                message.error('A room with the same name and type already exists.');
                setLoading(false);
                return;
            }
        } catch (error) {
            console.error(error);
            message.error('An error occurred while checking for existing rooms. Please try again later.');
            setLoading(false);
            return;
        }

        saveRoom(room)
            .then((response) => {
                console.log(response.data);
                setLoading(false);
                navigate('/ListRooms');
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    };

    const handleClearForm = () => {
        form.resetFields();
    };

    return (
        <div style={{ margin: 'auto', width: '40%', padding: '20px', boxShadow: '20px 20px 20px 20px #858280', borderRadius: '30px', marginTop: '40px', }}>
            <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Create Room</h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Room Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter the room name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Type of Room"
                    name="typeofRoom"
                    rules={[{ required: true, message: 'Please select the type of room!' }]}
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
                    rules={[{ required: true, message: 'Please enter the room capacity!' }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Add Room
                    </Button>
                    <Button onClick={handleClearForm} style={{ marginLeft: '10px' }}>Clear</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddRoom;
