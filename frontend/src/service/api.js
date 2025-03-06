import axios from "axios";
const API_URL = `http://localhost:5000/api`;

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
export const loginUsers = async (data) => axios.post(`${API_URL}/users/login`,data);
export const signupUsers = async (data) => axios.post(`${API_URL}/users/signup`,data);
export const updateUser = async (id, data) => axios.put(`${API_URL}/users/${id}`, data);
export const updatePassword = async (id, data) => axios.put(`${API_URL}/users/update-password/${id}`, data);
export const fetchUsers = async () => axios.get(`${API_URL}/users`);
export const deleteUser = async (id) => axios.delete(`${API_URL}/users/${id}`);
export const getUserById = async (id) => axios.get(`${API_URL}/users/${id}`);
export const forgotPassword = async (data) => axios.post(`${API_URL}/users/forgot-password`, data);
export const resetPassword = async (data) => axios.post(`${API_URL}/users/reset-password`, data);

//hoadon
export const fetchOrders = async () => axios.get(`${API_URL}/hoadons`);
export const getOrderById = async (id) => axios.get(`${API_URL}/hoadons/${id}`);

// Comments
export const fetchComments = async () => axios.get(`${API_URL}/comments`);
export const deleteComment = async (id) =>
  axios.delete(`${API_URL}/comments/${id}`);
export const fetchCommentById = async (id) =>
  axios.get(`${API_URL}/comments/${id}`);

//chitiethoadon
export const fetchChitiethoadons = async () =>
  axios.get(`${API_URL}/chitiethoadons`);

//sanpham
export const fetchProducts = async () => axios.get(`${API_URL}/sanphams`);
export const createProducts = async (data) =>
  axios.post(`${API_URL}/sanphams`, data);
export const updateProducts = async (id, data) =>
  axios.put(`${API_URL}/sanphams/${id}`, data);
export const deleteProducts = async (id) =>
  axios.delete(`${API_URL}/sanphams/${id}`);
export const getProducts = async (id) => axios.get(`${API_URL}/sanphams/${id}`);

//
export const fetchPromotion = async () => axios.get(`${API_URL}/promotions`);
export const deletePromotion = async (id) =>
  axios.delete(`${API_URL}/promotions/${id}`);
export const createPromotion = async (data) =>
  axios.post(`${API_URL}/promotions`, data);
export const updatePromotion = async (id, data) =>
  axios.put(`${API_URL}/promotions/${id}`, data);
export const getDetailPromotion = async (id) =>
  axios.get(`${API_URL}/promotions/${id}`);
