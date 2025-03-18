import React, { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { Form, Input, Button, Rate, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createDanhGia } from '../../../service/api';

const AddDanhgia = ({ onAddSuccess }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Hàm xử lý khi submit form
  const onFinish = async (values) => {
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      confirmAlert({
        title: 'Yêu cầu đăng nhập',
        message: 'Bạn cần đăng nhập để thêm đánh giá!',
        buttons: [
          {
            label: 'Đăng nhập ngay',
            onClick: () => navigate('/login')
          },
          {
            label: 'Hủy',
            onClick: () => {} // Không làm gì cả
          }
        ]
      });
      return;
    }
  
    try {
      setLoading(true);
      await createDanhGia(values);
      message.success("Thêm đánh giá thành công!");
  
      if (onAddSuccess) {
        onAddSuccess();
      }
  
      navigate('/listdanhgia'); 
    } catch (error) {
      console.error("Lỗi khi thêm đánh giá:", error);
      message.error("Thêm đánh giá thất bại, thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, width: '100%', maxWidth: 500, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Thêm đánh giá</h2>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên"
          name="Ten"
          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
        >
          <Input placeholder="Nhập tên" />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="NoiDung"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
        >
          <Input.TextArea placeholder="Nhập nội dung" />
        </Form.Item>

        <Form.Item
          label="Đánh giá"
          name="DanhGia"
          rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
        >
          <Rate />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            Thêm đánh giá
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddDanhgia;