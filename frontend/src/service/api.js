import axios from "axios";
const API_URL = "http://localhost:5000/api";

export const fetchUsers = async () => axios.get(`${API_URL}/users`);
export const deleteUser = async (id) => axios.delete(`${API_URL}/users/${id}`);
export const getUserById = async (id) => axios.get(`${API_URL}/users/${id}`);