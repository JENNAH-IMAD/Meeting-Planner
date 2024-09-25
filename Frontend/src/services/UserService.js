import axios from "axios";
import { getToken } from "./AuthService";

const BASE_REST_API_URL = 'http://localhost:8080/api/users';

axios.interceptors.request.use(function (config) {
    
    config.headers['Authorization'] = getToken();

    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });


// export function getAllUsers(){
//     return axios.get(BASE_REST_API_URL);
// }

export const getAllUsers = () => axios.get(BASE_REST_API_URL)

export const saveUser = (user) => axios.post(BASE_REST_API_URL, user)

export const getUser = (id) => axios.get(BASE_REST_API_URL + '/' + id)

export const updateUser = (id, user) => axios.put(BASE_REST_API_URL + '/' + id, user)

export const deleteUser = (id) => axios.delete(BASE_REST_API_URL + '/' + id)

export const getAllUsersWithRoles = () => axios.get(BASE_REST_API_URL + '/with-roles');


