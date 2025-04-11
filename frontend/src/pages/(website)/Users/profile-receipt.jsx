import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tag, Button, message, Modal, Select, DatePicker, Form, Input } from 'antd';
import { fetchOrdersByUserId, updateOrder } from '../../../service/api';
import moment from 'moment';
import axios from 'axios';
import io from 'socket.io-client';

const { Option } = Select;

const ProfileReceipt = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    Email: '',
    id: '',
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortTotal, setSortTotal] = useState('');
  const [form] = Form.useForm();

  // Khởi tạo kết nối Socket.IO
  const socket = io('http://localhost:5000', {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
  });

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userData.id) {
          const response = await fetchOrdersByUserId(userData.id);
          const sortedOrders = response.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setOrders(sortedOrders);
          setFilteredOrders(sortedOrders);
        }
      } catch (error) {
        message.error('Lỗi tải danh sách đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userData.id]);

  // Lắng nghe sự kiện Socket.IO
  useEffect(() => {
    socket.on('orderStatusUpdated', (data) => {
      if (data.userId === userData.id) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === data.orderId
              ? {
                  ...order,
                  paymentStatus: data.paymentStatus,
                  cancelledBy: data.cancelledBy,
                  cancellationDate: data.cancellationDate,
                  FeedBack: data.FeedBack,
                }
              : order
          )
        );
      }
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      socket.off('orderStatusUpdated');
      socket.off('connect');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [socket, userData.id]);

  useEffect(() => {
    let filtered = [...orders];

    if (statusFilter) {
      filtered = filtered.filter((order) => order.paymentStatus === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter((order) => {
        const createdAt = moment(order.createdAt).format('DD/MM/YYYY');
        return createdAt === dateFilter;
      });
    }

    if (sortTotal === 'high-to-low') {
      filtered = filtered.sort((a, b) => (b.total || 0) - (a.total || 0));
    } else if (sortTotal === 'low-to-high') {
      filtered = filtered.sort((a, b) => (a.total || 0) - (a.total || 0));
    } else {
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredOrders(filtered);
  }, [statusFilter, dateFilter, sortTotal, orders]);

  const updateProductQuantities = async (products, action) => {
    const API_URL = 'http://localhost:3000';
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
    let cancellationReason = '';

    Modal.confirm({
      title: 'Xác nhận huỷ đơn hàng',
      content: (
        <Form form={form}>
          <Form.Item
            name="reason"
            label="Lý Do Huỷ Đơn"
            rules={[{ required: true, message: 'Vui lòng nhập lý do huỷ đơn' }]}
          >
            <Input.TextArea
              placeholder="Nhập lý do huỷ đơn hàng..."
              rows={4}
              onChange={(e) => (cancellationReason = e.target.value)}
            />
          </Form.Item>
        </Form>
      ),
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await form.validateFields();
          const userData = JSON.parse(localStorage.getItem('userData'));
          let role = 'User';

          await updateOrder(orderId, {
            paymentStatus: 'Huỷ Đơn',
            FeedBack: cancellationReason,
            cancelledBy: {
              userId: userData.id,
              role: role,
              name: userData.Email,
            },
            cancellationDate: new Date(),
          });

          const order = orders.find((order) => order._id === orderId);
          if (order && order.paymentStatus === 'Đã Xác Nhận') {
            await updateProductQuantities(products, 'add');
          }

          setOrders(orders.filter((order) => order._id !== orderId));
          message.success('Huỷ đơn hàng thành công');
        } catch (error) {
          if (error.errorFields) {
            return Promise.reject();
          }
          message.error('Huỷ đơn hàng thất bại');
          console.error(error);
        }
      },
    });
  };

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
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total) => (total ? `${total.toLocaleString()} VND` : 'Không có'),
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
          case 'Đang giao':
            color = 'purple';
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
      render: (_, record) => {
        const reviewedOrders = JSON.parse(localStorage.getItem('reviewedOrders') || '{}');
        const isReviewed = reviewedOrders[record._id];

        return (
          <>
            {(record.paymentStatus === 'Chờ xử lý' || record.paymentStatus === 'Đã Xác Nhận') && (
              <Button danger onClick={() => handleCancelOrder(record._id, record.products)}>
                Huỷ đơn
              </Button>
            )}
            {record.paymentStatus === 'Hoàn thành' && !isReviewed && (
              <Link to={`/adddanhgiauser/${record._id}`}>
                <Button type="primary">Đánh giá</Button>
              </Link>
            )}
            {record.paymentStatus === 'Hoàn thành' && isReviewed && (
              <Button type="primary" disabled>
                Đã đánh giá
              </Button>
            )}
          </>
        );
      },
    },
  ];

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
            <div className="mb-6 flex items-center gap-6">
              <div>
                <label htmlFor="statusFilter" className="mr-2">
                  Lọc theo trạng thái:
                </label>
                <Select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                  style={{ width: 200 }}
                  placeholder="Chọn trạng thái"
                  allowClear
                >
                  <Option value="">Tất cả</Option>
                  <Option value="Chờ xử lý">Chờ xử lý</Option>
                  <Option value="Đã Xác Nhận">Đã Xác Nhận</Option>
                  <Option value="Đang giao">Đang giao</Option>
                  <Option value="Huỷ Đơn">Huỷ Đơn</Option>
                  <Option value="Hoàn thành">Hoàn thành</Option>
                </Select>
              </div>
              <div>
                <label htmlFor="dateFilter" className="mr-2">
                  Tìm theo ngày:
                </label>
                <DatePicker
                  id="dateFilter"
                  format="DD/MM/YYYY"
                  onChange={(date, dateString) => setDateFilter(dateString)}
                  style={{ width: 200 }}
                  placeholder="Chọn ngày"
                  allowClear
                />
              </div>
              <div>
                <label htmlFor="sortTotal" className="mr-2">
                  Sắp xếp tổng tiền:
                </label>
                <Select
                  id="sortTotal"
                  value={sortTotal}
                  onChange={(value) => setSortTotal(value)}
                  style={{ width: 200 }}
                  placeholder="Chọn sắp xếp"
                  allowClear
                >
                  <Option value="">Mặc định</Option>
                  <Option value="low-to-high">Thấp đến cao</Option>
                  <Option value="high-to-low">Cao đến thấp</Option>
                </Select>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={filteredOrders}
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