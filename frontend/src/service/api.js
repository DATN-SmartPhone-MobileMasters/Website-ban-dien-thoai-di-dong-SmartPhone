import axios from "axios";
const API_URL = `http://localhost:5000/api`;
//thuong
export const fetchBrands = async () => axios.get(`${API_URL}/thuonghieus`);
export const createBrand = async (data) =>
  axios.post(`${API_URL}/thuonghieus`, data);
export const updateBrand = async (id, data) =>
  axios.put(`${API_URL}/thuonghieus/${id}`, data);
export const deleteBrand = async (id) =>
  axios.delete(`${API_URL}/thuonghieus/${id}`);
export const getBrandById = async (id) =>
  axios.get(`${API_URL}/thuonghieus/${id}`);
// api danh muc
export const fetchCategories = async () => axios.get(`${API_URL}/danhmucs`);

export const createCategory = async (data) =>
  axios.post(`${API_URL}/danhmucs`, data, {
    headers: { "Content-Type": "application/json" },
  });

export const updateCategory = async (id, data) =>
  axios.put(`${API_URL}/danhmucs/${id}`, data);
export const deleteCategory = async (id) =>
  axios.delete(`${API_URL}/danhmucs/${id}`);
export const fetchCategoryById = async (id) =>
  axios.get(`${API_URL}/danhmucs/${id}`);

//users
export const fetchUsers = async () => axios.get(`${API_URL}/users`);
export const deleteUser = async (id) => axios.delete(`${API_URL}/users/${id}`);
export const getUserById = async (id) => axios.get(`${API_URL}/users/${id}`);

//hoadon
export const fetchOrders = async () => axios.get(`${API_URL}/hoadons`);
export const getOrderById = async (id) => axios.get(`${API_URL}/hoadons/${id}`);

