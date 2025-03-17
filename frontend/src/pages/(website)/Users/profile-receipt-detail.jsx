import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchOrdersByUserId } from '../../../service/api';

const ProfileReceiptDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ Email: '', id: '' });
  const { id: orderId } = useParams();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userData.id) {
          const response = await fetchOrdersByUserId(userData.id);
          const orders = response.data.data;
          const foundOrder = orders.find(order => order._id === orderId);

          if (foundOrder) {
            setOrder(foundOrder);
          } else {
            console.error("Order not found in user's orders");
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData.id, orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-gray-50">
        <div className="text-center">
          <div className="spinner-border text-blue-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-blue-800">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-blue-800">Không tìm thấy đơn hàng</h2>
          <p className="text-blue-600 mt-2">Đơn hàng bạn đang tìm kiếm không tồn tại.</p>
          <Link
            to={`/profile-receipt/${userData.id}`}
            className="mt-4 inline-block text-blue-600 hover:text-blue-800 transition duration-200"
          >
            <i className="fas fa-long-arrow-alt-left mr-2"></i> Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-50">
      <div className="container mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Container - Sidebar */}
          <div className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md border border-blue-100">
            <div className="flex items-center mb-6">
              <span className="text-blue-800 font-semibold">{userData.Email}</span>
            </div>
            <ul className="space-y-3">
              <li>
                <Link
                  to={`/account-details/${userData.id}`}
                  className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition duration-200"
                >
                  <i className="fa fa-user mr-3 text-blue-600"></i>
                  <span className="text-blue-700">Thông tin tài khoản</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/account/${userData.id}`}
                  className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition duration-200"
                >
                  <i className="fa fa-edit mr-3 text-blue-600"></i>
                  <span className="text-blue-700">Cập nhật thông tin</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/profile-receipt/${userData.id}`}
                  className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition duration-200"
                >
                  <i className="fas fa-money-check mr-3 text-blue-600"></i>
                  <span className="text-blue-700">Quản lý đơn hàng</span>
                </Link>
              </li>
              <li>
                <Link
                  to={`/profile-reset-password/${userData.id}`}
                  className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition duration-200"
                >
                  <i className="fas fa-lock mr-3 text-blue-600"></i>
                  <span className="text-blue-700">Đổi mật khẩu</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Container - Order Details */}
          <div className="w-full lg:w-3/4 bg-white p-8 rounded-lg shadow-md border border-blue-100">
            <h3 className="text-2xl font-semibold mb-6 text-blue-800">Chi tiết đơn hàng</h3>

            {/* Order Information */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-blue-700">Thông tin đơn hàng</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600">Mã đơn hàng:</p>
                  <p className="font-medium text-blue-800">{order._id}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600">Ngày đặt hàng:</p>
                  <p className="font-medium text-blue-800">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600">Tình trạng:</p>
                  <p className="font-medium text-blue-800">{order.paymentStatus}</p>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-blue-700">Thông tin nhận hàng</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600">Tên khách hàng:</p>
                  <p className="font-medium text-blue-800">{order.shippingInfo.name}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600">Số điện thoại:</p>
                  <p className="font-medium text-blue-800">{order.shippingInfo.phone}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600">Địa chỉ:</p>
                  <p className="font-medium text-blue-800">{order.shippingInfo.address}</p>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-blue-700">Sản phẩm</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <tbody>
                    {order.products?.map((product, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 mr-4 rounded-lg"
                            />
                            <div>
                              <p className="font-medium text-blue-800">{product.name}</p>
                              <p className="text-sm text-blue-600">
                                {product.memory} - {product.color}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-blue-700">Tổng thanh toán</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600">Tổng tiền:</p>
                  <p className="font-medium text-blue-800">
                    {order.total.toLocaleString()}đ
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600">Phí vận chuyển:</p>
                  <p className="font-medium text-blue-800">20,000đ</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-600">Tổng thanh toán:</p>
                  <p className="font-medium text-blue-800">
                    {(order.total + 20000).toLocaleString()}đ
                  </p>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <Link
              to={`/profile-receipt/${userData.id}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
            >
              <i className="fas fa-long-arrow-alt-left mr-2"></i>
              Quay lại danh sách đơn hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileReceiptDetails;