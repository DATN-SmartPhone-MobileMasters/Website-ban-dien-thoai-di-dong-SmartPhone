import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchOrdersByUserId } from '../../../service/api'; // Changed to fetchOrdersByUserId

const ProfileReceiptDetails = () => {
  const [orders, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ Email: '', id: '' });
  const { id: orderId } = useParams(); // Rename to `orderId` for clarity

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
          // 1. Fetch ALL orders for this user
          const response = await fetchOrdersByUserId(userData.id);
          const orders = response.data.data; // Array of orders

          // 2. Find the specific orders by orderId (from URL)
          const foundOrder = orders.find(orders => orders._id === orderId);
          
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
  }, [userData.id, orderId]); // Depend on orderId

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!orders) {
    return <div className="text-center py-8">Order not found</div>;
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
            <h3 className="text-2xl font-light mb-6">Chi tiết đơn hàng</h3>
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Thông tin đơn hàng</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Mã đơn hàng:</p>
                  <p className="font-medium">{orders._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày đặt hàng:</p>
                  <p className="font-medium">{new Date(orders.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tình trạng:</p>
                  <p className="font-medium">{orders.paymentStatus}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Thông tin nhận hàng</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tên khách hàng:</p>
                  <p className="font-medium">{orders.shippingInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại:</p>
                  <p className="font-medium">{orders.shippingInfo.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Địa chỉ:</p>
                  <p className="font-medium">{orders.shippingInfo.address}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Sản phẩm</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <tbody>
                    {orders.products?.map((product, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border">
                          <div className="flex items-center">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-16 h-16 mr-4" 
                            />
                            <div>
                              <p className="font-medium">{product.name }</p>
                              <p className="text-sm text-gray-600">
                                {product.memory} - {product.color }
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

            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Tổng thanh toán</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tổng tiền:</p>
                  <p className="font-medium">{orders.total.toLocaleString()}đ</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phí vận chuyển:</p>
                  <p className="font-medium">20,000đ</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng thanh toán:</p>
                  <p className="font-medium">{(orders.total + 20000).toLocaleString()}đ</p>
                </div>
              </div>
            </div>

            <Link to={`/profile-receipt/${userData.id}`} className="text-blue-500 hover:underline">
              <i className="fas fa-long-arrow-alt-left mr-2"></i> Quay lại danh sách đơn hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileReceiptDetails;