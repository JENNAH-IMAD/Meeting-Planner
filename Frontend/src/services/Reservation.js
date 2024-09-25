import axios from "axios";
import { getToken } from "./AuthService";

const BASE_REST_API_URL = 'http://localhost:8080/api/reservations';

axios.interceptors.request.use(function (config) {
    
    config.headers['Authorization'] = getToken();

    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// export function getAllReservations(){
//     return axios.get(BASE_REST_API_URL);
// }

export const getAllReservations = () => axios.get(BASE_REST_API_URL)

export const saveReservation= (reservation) => axios.post(BASE_REST_API_URL, reservation)

export const getReservation= (id) => axios.get(BASE_REST_API_URL + '/' + id)

export const updateReservation= (id, reservation) => axios.put(BASE_REST_API_URL + '/' + id, reservation)

export const deleteReservation= (id) => axios.delete(BASE_REST_API_URL + '/' + id)
