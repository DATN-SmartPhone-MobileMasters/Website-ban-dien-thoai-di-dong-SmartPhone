import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { fetchOrdersByUserId,updateOrder  } from '../../../service/api';

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
  const handleCancelOrder = async (orderId) => {
    confirmAlert({
      title: 'Xác nhận huỷ đơn hàng',
      message: 'Bạn có chắc chắn muốn huỷ đơn hàng này?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            try {
              await updateOrder(orderId, { paymentStatus: 'Huỷ Đơn' });
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
          <div className="w-3/4 bg-white p-8 rounded-lg shadow-md">
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
                          Xem chi tiết
                        </Link>
                      </td>
                      <td className="py-2 px-4 border">{order.paymentStatus}</td>
                      <td className="py-2 px-4 border">
                        {order.paymentStatus === 'Chờ xử lý'||order.paymentStatus === 'Đã Xác Nhận' && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="text-red-500 hover:underline"
                          >
                            Huỷ Đơn Hàng
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