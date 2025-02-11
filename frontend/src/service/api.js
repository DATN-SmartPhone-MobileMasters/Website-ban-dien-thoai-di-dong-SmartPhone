import axios from "axios";
const API_URL = "http://localhost:5000/api";

export const fetchBrands = async () => axios.get(`${API_URL}/thuonghieus`);
export const createBrand = async (data) => axios.post(`${API_URL}/thuonghieus`, data);
export const updateBrand = async (id, data) => axios.put(`${API_URL}/thuonghieus/${id}`, data);
export const deleteBrand = async (id) => axios.delete(`${API_URL}/thuonghieus/${id}`);
export const getBrandById = async (id) => axios.get(`${API_URL}/thuonghieus/${id}`);

export const fetchCategories = async () => axios.get(`${API_URL}/danhmucs`);