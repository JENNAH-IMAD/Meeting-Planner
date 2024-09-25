import React from 'react';
import { NavLink } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { isUserLoggedIn, logout } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import { isAdminUser } from '../../services/AuthService'
import {UserAddOutlined,CalendarOutlined,} from '@ant-design/icons';
import {  MdRoomPreferences, MdOutlineNoteAlt,MdOutlineMeetingRoom  } from "react-icons/md";
import { PiNotepadBold } from "react-icons/pi";
import { CgUserList } from "react-icons/cg";


const { Header } = Layout;

const HeaderComponent = () => {

    const isAdmin = isAdminUser();

    const isAuth = isUserLoggedIn();
    const navigator = useNavigate();

    const handleLogout = () => {
        logout();
        navigator('/login');
    };

    return (
        <Header style={{ display: 'flex', alignItems:'center',justifyContent: 'space-between' }}>
            <Menu theme="dark" mode="horizontal"  style={{}}>
           
                <Menu.Item key="1" icon={<HomeOutlined />}>
                    <NavLink to="/">Meeting Planner</NavLink>
                </Menu.Item>
                {isAuth && (
                    <>
                    <Menu.Item key="2" style={{ marginLeft: 5 }} icon={<MdRoomPreferences />}>
                        <NavLink to="/ListRooms">Rooms</NavLink>
                    </Menu.Item>
                    <Menu.Item key="3" style={{ marginLeft: 5 }} icon={<CgUserList />}>
                        <NavLink to="/ListUser">Users</NavLink>
                    </Menu.Item>
                    <Menu.Item key="4" style={{ marginLeft: 5 }} icon={<MdOutlineNoteAlt />}>
                        <NavLink to="/ListReservation">Reservations</NavLink>
                    </Menu.Item>
                    <Menu.Item key="5" style={{ marginLeft: 5 }} icon={<PiNotepadBold  />}>
                        <NavLink to="/AddReservation">Creat Reservation</NavLink>
                    </Menu.Item>

                    {isAdmin &&(
                    <>
                    <Menu.Item key="6" style={{ marginLeft: 5 }} icon={<MdOutlineMeetingRoom  />}>
                        <NavLink to="/AddRoom">Creat Room</NavLink>
                    </Menu.Item>
                    <Menu.Item key="7" style={{ marginLeft: 5 }} icon={<UserAddOutlined />}>
                        <NavLink to="/AddUser">Creat User</NavLink>
                    </Menu.Item>
                    </>
                    )}
                    </>
                )}
            </Menu>
            <Menu theme="dark" mode="horizontal"   style={{}}>
                {!isAuth && (
                    <>
                        <Menu.Item key="8" style={{ marginLeft: 20 }} icon={<UserOutlined />}>
                            <NavLink to="/register">Register</NavLink>
                        </Menu.Item>
                        <Menu.Item key="9" style={{ marginLeft: 20 }} icon={<LoginOutlined />}>
                            <NavLink to="/login">Login</NavLink>
                        </Menu.Item>
                    </>
                )}
                {isAuth && (
                    <>
                    <Menu.Item key="10" style={{ marginLeft: 5 }} icon={<CalendarOutlined />}>
                    <NavLink to="/Scheduler ">calendar</NavLink>
                    </Menu.Item>
                    <Menu.Item key="11" icon={<LoginOutlined />} onClick={handleLogout}>
                        Logout
                    </Menu.Item>
                    </>
                )}
            </Menu>
        </Header>
    );
};

export default HeaderComponent;
