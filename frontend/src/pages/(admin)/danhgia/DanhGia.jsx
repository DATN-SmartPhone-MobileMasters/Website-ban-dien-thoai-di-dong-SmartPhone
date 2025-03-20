import React, { useEffect, useState, forwardRef } from 'react';
import { Table, Rate, Button, Popconfirm, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchDanhGias, deleteDanhGia } from '../../../service/api';
import moment from 'moment';

const { Option } = Select;

const DanhGia = forwardRef(({ isReadOnly = false }, ref) => {
  const [danhGias, setDanhGias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStar, setSelectedStar] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const navigate = useNavigate();

  const getDanhGias = async () => {
    try {
      setLoading(true);
      const response = await fetchDanhGias();
      setDanhGias(response.data?.data ?? []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đánh giá:", error);
      setDanhGias([]);
    } finally {
      setLoading(false);
    }
  };

  React.useImperativeHandle(ref, () => ({ getDanhGias }));

  useEffect(() => {
    getDanhGias();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDanhGia(id);
      message.success("Xóa đánh giá thành công!");
      getDanhGias();
    } catch (error) {
      message.error("Xóa thất bại, thử lại sau!");
    }
  };

  const handleSelectChange = (value) => setSelectedStar(value || null);
  const handleSortChange = (value) => setSortOrder(value);

  let filteredDanhGias = selectedStar !== null
    ? danhGias.filter((dg) => Number(dg.DanhGia) === selectedStar)
    : danhGias;

  if (sortOrder === 'newest') {
    filteredDanhGias.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortOrder === 'oldest') {
    filteredDanhGias.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }

  const columns = [
    { title: 'Tên', dataIndex: 'Ten', key: 'Ten', align: 'center' },
    { title: 'Nội dung', dataIndex: 'NoiDung', key: 'NoiDung' },
    {
      title: 'Đánh giá', dataIndex: 'DanhGia', key: 'DanhGia', align: 'center',
      render: (value) => <Rate disabled defaultValue={Number(value)} />
    },
    {
      title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at', align: 'center',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm:ss')
    }
  ];

  if (!isReadOnly) {
    columns.push({
      title: 'Hành động', key: 'actions', align: 'center',
      render: (record) => (
        <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record._id)} okText="Có" cancelText="Hủy">
          <Button type="primary" danger>Xóa</Button>
        </Popconfirm>
      )
    });
  }

  return (
    <div style={{ padding: 20, width: '100%', height: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Danh sách đánh giá</h2>
      <div style={{ marginBottom: 20, display: 'flex', gap: 20 }}>
        <div>
          <span style={{ marginRight: 10 }}>Lọc theo số sao:</span>
          <Select placeholder="Chọn số sao" style={{ width: 120 }} onChange={handleSelectChange} allowClear>
            {[1, 2, 3, 4, 5].map((value) => <Option key={value} value={value}>{value} Sao</Option>)}
          </Select>
        </div>
        <div>
          <span style={{ marginRight: 10 }}>Sắp xếp:</span>
          <Select placeholder="Chọn kiểu sắp xếp" style={{ width: 150 }} onChange={handleSortChange} allowClear>
            <Option value="newest">Gần nhất</Option>
            <Option value="oldest">Lâu nhất</Option>
          </Select>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredDanhGias}
        rowKey={(record) => record._id}
        bordered
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
    </div>
  );
});

export default DanhGia;
