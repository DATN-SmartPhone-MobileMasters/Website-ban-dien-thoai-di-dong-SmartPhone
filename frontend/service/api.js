import axios from "axios";
const API_URL = `http://localhost:5000/api`;

// Khuyến mãi
export const getPromotions = async () => {
  try {
    const response = await axios.get(`${API_URL}/promotions`);
    return response.data.data;
  } catch (error) {}
};
