import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tag, Button, message } from 'antd';
import { fetchOrdersByUserId, updateOrder } from '../../../service/api';
import axios from 'axios';

const API_URL = `http://localhost:5000/api`;

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
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: '_id',
      width: 200,
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: ['shippingInfo', 'name'],
      key: 'name',
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Chi tiết đơn hàng',
      key: 'details',
      render: (_, record) => (
        <Link to={`/profile-receipt-details/${record._id}`}>
          <Button type="primary" ghost>
            Xem chi tiết
          </Button>
        </Link>
      ),
    },
    {
      title: 'Tình trạng đơn hàng',
      dataIndex: 'paymentStatus',
      key: 'status',
      render: (status) => {
        let color = '';
        switch (status) {
          case 'Đã Xác Nhận':
            color = 'green';
            break;
          case 'Chờ xử lý':
            color = 'orange';
            break;
          case 'Huỷ Đơn':
            color = 'red';
            break;
          case 'Hoàn thành':
            color = 'blue';
            break;
          default:
            color = 'gray';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <>
          {(record.paymentStatus === 'Chờ xử lý' || record.paymentStatus === 'Đã Xác Nhận') && (
            <Button danger onClick={() => handleCancelOrder(record._id, record.products)}>
              Huỷ đơn
            </Button>
          )}
          {record.paymentStatus === 'Hoàn thành' && (
            <Link to={`/adddanhgiauser`}>
              <Button type="primary">
                Đánh giá
              </Button>
            </Link>
          )}
        </>
      ),
    },
  ];

  const updateProductQuantities = async (products, action) => {
    for (const product of products) {
      try {
        const { data } = await axios.get(`${API_URL}/sanphams/${product.productId}`);
        let updatedQuantity1 = data.data.SoLuong1;
        let updatedQuantity2 = data.data.SoLuong2;
        let updatedQuantity3 = data.data.SoLuong3;

        if (product.memory === data.data.BoNhoTrong1) {
          updatedQuantity1 =
            action === 'subtract'
              ? data.data.SoLuong1 - product.quantity
              : data.data.SoLuong1 + product.quantity;
        } else if (product.memory === data.data.BoNhoTrong2) {
          updatedQuantity2 =
            action === 'subtract'
              ? data.data.SoLuong2 - product.quantity
              : data.data.SoLuong2 + product.quantity;
        } else if (product.memory === data.data.BoNhoTrong3) {
          updatedQuantity3 =
            action === 'subtract'
              ? data.data.SoLuong3 - product.quantity
              : data.data.SoLuong3 + product.quantity;
        }

        await axios.put(`${API_URL}/sanphams/${product.productId}`, {
          SoLuong1: updatedQuantity1,
          SoLuong2: updatedQuantity2,
          SoLuong3: updatedQuantity3,
        });
      } catch (error) {
        console.error('Lỗi khi cập nhật số lượng sản phẩm:', error);
      }
    }
  };

  const handleCancelOrder = async (orderId, products) => {
    try {
      await updateOrder(orderId, { paymentStatus: 'Huỷ Đơn' });
      const order = orders.find((order) => order._id === orderId);
      if (order && order.paymentStatus === 'Đã Xác Nhận') {
        await updateProductQuantities(products, 'add');
      }

      const response = await fetchOrdersByUserId(userData.id);
      setOrders(response.data.data);

      message.success('Huỷ đơn hàng thành công');
    } catch (error) {
      message.error('Huỷ đơn hàng thất bại');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userData.id) {
          const response = await fetchOrdersByUserId(userData.id);
          setOrders(response.data.data);
        }
      } catch (error) {
        message.error('Lỗi tải danh sách đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userData.id]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <div className="flex">
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
                  <span>Update tài khoản</span>
                </Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-200 rounded">
                <Link to={`/profile-receipt/${userData.id}`} className="flex items-center gap-2">
                  <i className="fas fa-money-check mr-2"></i>
                  <span>Thông tin đơn hàng</span>
                </Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-200 rounded">
                <Link to={`/profile-reset-password/${userData.id}`} className="flex items-center gap-2">
                  <i className="fas fa-lock mr-2"></i>
                  <span>Thay đổi mật khẩu</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="w-full bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-light mb-6">Đơn hàng đã đặt</h3>
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="_id"
              loading={loading}
              scroll={{ x: 1000 }}
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                hideOnSinglePage: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileReceipt;