import axios from "axios";
import { getToken } from "./AuthService";

const BASE_REST_API_URL = 'http://localhost:8080/api/rooms';

axios.interceptors.request.use(function (config) {
    
    config.headers['Authorization'] = getToken();

    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// export function getAllRooms(){
//     return axios.get(BASE_REST_API_URL);
// }

export const getAllRooms = () => axios.get(BASE_REST_API_URL)

export const saveRoom = (room) => axios.post(BASE_REST_API_URL, room)

export const getRoom = (id) => axios.get(BASE_REST_API_URL + '/' + id)

export const updateRoom = (id, room) => axios.put(BASE_REST_API_URL + '/' + id, room)

export const deleteRoom = (id) => axios.delete(BASE_REST_API_URL + '/' + id)

