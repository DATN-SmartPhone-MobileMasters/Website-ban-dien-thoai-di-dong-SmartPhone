import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tag, Button, message, Modal, Select, DatePicker } from 'antd';
import { fetchOrdersByUserId, updateOrder } from '../../../service/api';
import moment from 'moment'; // Thêm moment để xử lý định dạng ngày

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
          // Sắp xếp đơn hàng theo createdAt giảm dần
          const sortedOrders = response.data.data.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setOrders(sortedOrders);
          setFilteredOrders(sortedOrders); // Ban đầu hiển thị tất cả
        }
      } catch (error) {
        message.error('Lỗi tải danh sách đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userData.id]);

  // Xử lý lọc và sắp xếp khi các bộ lọc thay đổi
  useEffect(() => {
    let filtered = [...orders];

    // Lọc theo trạng thái
    if (statusFilter) {
      filtered = filtered.filter(
        (order) => order.paymentStatus === statusFilter
      );
    }

    // Lọc theo ngày
    if (dateFilter) {
      filtered = filtered.filter((order) => {
        const createdAt = moment(order.createdAt).format('MM/DD/YY');
        return createdAt === dateFilter;
      });
    }

    // Sắp xếp theo tổng tiền
    if (sortTotal === 'high-to-low') {
      filtered = filtered.sort((a, b) => (b.total || 0) - (a.total || 0));
    } else if (sortTotal === 'low-to-high') {
      filtered = filtered.sort((a, b) => (a.total || 0) - (b.total || 0));
    }

    setFilteredOrders(filtered);
  }, [statusFilter, dateFilter, sortTotal, orders]);

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
      render: (date) => moment(date).format('MM/DD/YY'), 
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
              <Button danger onClick={() => handleCancelOrder(record._id)}>
                Huỷ đơn
              </Button>
            )}
            {record.paymentStatus === 'Hoàn thành' && !isReviewed && (
              <Link to={`/adddanhgiauser/${record._id}`}>
                <Button type="primary">
                  Đánh giá
                </Button>
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

  const handleCancelOrder = async (orderId) => {
    Modal.confirm({
      title: 'Xác nhận huỷ đơn hàng',
      content: 'Bạn có chắc chắn muốn huỷ đơn hàng này không?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // Cập nhật trạng thái đơn hàng thành "Huỷ Đơn"
          await updateOrder(orderId, { paymentStatus: 'Huỷ Đơn' });

          // Lấy lại danh sách đơn hàng mới
          const response = await fetchOrdersByUserId(userData.id);
          // Sắp xếp đơn hàng theo createdAt giảm dần
          const sortedOrders = response.data.data.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setOrders(sortedOrders);
          setFilteredOrders(sortedOrders);

          message.success('Huỷ đơn hàng thành công');
        } catch (error) {
          message.error('Huỷ đơn hàng thất bại');
        }
      },
    });
  };

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
            {/* Bộ lọc */}
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
                >
                  <Option value="">Tất cả</Option>
                  <Option value="Chờ xử lý">Chờ xử lý</Option>
                  <Option value="Đã Xác Nhận">Đã Xác Nhận</Option>
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
                  format="MM/DD/YY"
                  onChange={(date, dateString) => setDateFilter(dateString)}
                  style={{ width: 200 }}
                  placeholder="Chọn ngày"
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
                >
                  <Option value="">Mặc định</Option>
                  <Option value="high-to-low">Cao đến thấp</Option>
                  <Option value="low-to-high">Thấp đến cao</Option>
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