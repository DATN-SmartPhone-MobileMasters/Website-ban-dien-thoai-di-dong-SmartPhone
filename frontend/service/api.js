import axios from "axios";
const API_URL = `http://localhost:5000/api`;

export const fetchPromotion = async () => axios.get(`${API_URL}/promotions`);
export const deletePromotion = async (id) =>
  axios.delete(`${API_URL}/promotions/${id}`);
export const createPromotion = async (data) =>
  axios.post(`${API_URL}/promotions`, data);
export const updatePromotion = async (id, data) =>
  axios.put(`${API_URL}/promotions/${id}`, data);
export const getDetailPromotion = async (id) =>
  axios.get(`${API_URL}/promotions/${id}`);
