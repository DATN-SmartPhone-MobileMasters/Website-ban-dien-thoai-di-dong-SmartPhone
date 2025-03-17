import React, { useEffect, useState, forwardRef } from 'react';
import { Table, Rate, Button, Popconfirm, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchDanhGias, deleteDanhGia } from '../../../service/api';
import moment from 'moment';

const DanhGia = forwardRef(({ isReadOnly = false }, ref) => {
  const [danhGias, setDanhGias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hàm fetch danh sách đánh giá
  const getDanhGias = async () => {
    try {
      setLoading(true);
      const response = await fetchDanhGias();
      console.log("Dữ liệu trả về từ API:", response.data);

      if (response.data && Array.isArray(response.data.data)) {
        setDanhGias(response.data.data);
      } else {
        console.error("Dữ liệu không hợp lệ:", response.data);
        setDanhGias([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đánh giá:", error);
      setDanhGias([]);
    } finally {
      setLoading(false);
    }
  };

  // Cho phép ref truy cập vào hàm getDanhGias
  React.useImperativeHandle(ref, () => ({
    getDanhGias,
  }));

  useEffect(() => {
    getDanhGias();
  }, []);

  // Hàm xóa đánh giá
  const handleDelete = async (id) => {
    try {
      await deleteDanhGia(id);
      message.success("Xóa đánh giá thành công!");
      getDanhGias(); // Cập nhật lại danh sách sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      message.error("Xóa thất bại, thử lại sau!");
    }
  };

  // Cột của bảng
  const columns = [
    {
      title: 'Tên',
      dataIndex: 'Ten',
      key: 'Ten',
      align: 'center',
    },
    {
      title: 'Nội dung',
      dataIndex: 'NoiDung',
      key: 'NoiDung',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'DanhGia',
      key: 'DanhGia',
      align: 'center',
      render: (value) => <Rate disabled defaultValue={value} />,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm:ss'),
    },
  ];

  // Thêm cột hành động nếu không phải chế độ chỉ đọc
  if (!isReadOnly) {
    columns.push({
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      render: (record) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDelete(record._id)}
          okText="Có"
          cancelText="Hủy"
        >
          <Button type="primary" danger>
            Xóa
          </Button>
        </Popconfirm>
      ),
    });
  }

  return (
    <div style={{ padding: 20, width: '100%', height: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Danh sách đánh giá</h2>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={danhGias}
          rowKey={(record) => record._id}
          bordered
          pagination={{ pageSize: 10 }}
          loading={loading}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
});

export default DanhGia;