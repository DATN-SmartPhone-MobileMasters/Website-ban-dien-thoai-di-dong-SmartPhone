import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { fetchOrdersByUserId, updateOrder } from '../../../service/api';
import axios from 'axios';

const API_URL = "http://localhost:5000/api"; // Thay thế bằng API URL của bạn

const ProfileReceipt = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    Email: '',
    id: '',
  });

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  const updateProductQuantities = async (products, action) => {
    for (const product of products) {
      try {
        // Lấy thông tin sản phẩm hiện tại
        const { data } = await axios.get(`${API_URL}/sanphams/${product.productId}`);

        // Xác định phiên bản sản phẩm dựa trên bộ nhớ được chọn
        let updatedQuantity1 = data.data.SoLuong1;
        let updatedQuantity2 = data.data.SoLuong2;
        let updatedQuantity3 = data.data.SoLuong3;

        if (product.memory === data.data.BoNhoTrong1) {
          updatedQuantity1 =
            action === "subtract"
              ? data.data.SoLuong1 - product.quantity
              : data.data.SoLuong1 + product.quantity;
        } else if (product.memory === data.data.BoNhoTrong2) {
          updatedQuantity2 =
            action === "subtract"
              ? data.data.SoLuong2 - product.quantity
              : data.data.SoLuong2 + product.quantity;
        } else if (product.memory === data.data.BoNhoTrong3) {
          updatedQuantity3 =
            action === "subtract"
              ? data.data.SoLuong3 - product.quantity
              : data.data.SoLuong3 + product.quantity;
        }

        // Cập nhật số lượng sản phẩm
        await axios.put(`${API_URL}/sanphams/${product.productId}`, {
          SoLuong1: updatedQuantity1,
          SoLuong2: updatedQuantity2,
          SoLuong3: updatedQuantity3,
        });
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
      }
    }
  };

  const handleCancelOrder = async (orderId, products) => {
    confirmAlert({
      title: 'Xác nhận huỷ đơn hàng',
      message: 'Bạn có chắc chắn muốn huỷ đơn hàng này?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            try {
              // Cập nhật trạng thái đơn hàng thành "Huỷ Đơn"
              await updateOrder(orderId, { paymentStatus: 'Huỷ Đơn' });

              // Trả lại số lượng sản phẩm
              await updateProductQuantities(products, "add");

              // Cập nhật lại danh sách đơn hàng
              const response = await fetchOrdersByUserId(userData.id);
              setOrders(response.data.data);

              confirmAlert({
                title: 'Thành công',
                message: 'Huỷ đơn hàng thành công!',
                buttons: [
                  {
                    label: 'OK',
                    onClick: () => {}
                  }
                ]
              });
            } catch (error) {
              console.error("Lỗi khi huỷ đơn:", error);
              confirmAlert({
                title: 'Lỗi',
                message: 'Huỷ đơn thất bại!',
                buttons: [
                  {
                    label: 'OK',
                    onClick: () => {}
                  }
                ]
              });
            }
          }
        },
        {
          label: 'Không',
          onClick: () => {}
        }
      ]
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userData.id) {
          const response = await fetchOrdersByUserId(userData.id);
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userData.id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <div className="flex">
          {/* Left Container */}
          <div className="w-1/4 bg-white p-4 rounded-lg shadow-md mr-4">
            <div className="flex items-center mb-4">
              <span className="text-black font-semibold">{userData.Email}</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center p-2 hover:bg-gray-200 rounded">
                <Link to={`/account-details/${userData.id}`} className="flex items-center gap-2">
                  <i className="fa fa-user mr-2"></i>
                  <span>Thông tin tài khoản</span>
                </Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-200 rounded">
                <Link to={`/account/${userData.id}`} className="flex items-center gap-2">
                  <i className="fa fa-edit mr-2"></i>
                  <span>Cập nhập thông tin tài khoản</span>
                </Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-200 rounded">
                <Link to={`/profile-receipt/${userData.id}`} className="flex items-center gap-2">
                  <i className="fas fa-money-check mr-2"></i>
                  <span>Quản lý đơn hàng</span>
                </Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-200 rounded">
                <Link to={`/profile-reset-password/${userData.id}`} className="flex items-center gap-2">
                  <i className="fas fa-lock mr-2"></i>
                  <span>Đổi mật khẩu</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Container */}
          <div className="w-full bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-light mb-6">Đơn hàng đã đặt</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 border">Mã đơn hàng</th>
                    <th className="py-2 px-4 border">Tên khách hàng</th>
                    <th className="py-2 px-4 border">Ngày đặt hàng</th>
                    <th className="py-2 px-4 border">Chi tiết đơn hàng</th>
                    <th className="py-2 px-4 border">Tình trạng đơn hàng</th>
                    <th className="py-2 px-4 border">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border">{order._id}</td>
                      <td className="py-2 px-4 border">{order.shippingInfo.name}</td>
                      <td className="py-2 px-4 border">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border">
                        <Link to={`/profile-receipt-details/${order._id}`} className="text-blue-500 hover:underline">
                          <button className="px-4 py-2 bg-blue-500 text-white rounded">Chi tiết</button>
                        </Link>
                      </td>
                      <td className="py-2 px-4 border">{order.paymentStatus}</td>
                      <td className="py-2 px-4 border">
                        {(order.paymentStatus === 'Chờ xử lý' || order.paymentStatus === 'Đã Xác Nhận') && (
                          <button
                            onClick={() => handleCancelOrder(order._id, order.products)}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                          >
                            Huỷ
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileReceipt;