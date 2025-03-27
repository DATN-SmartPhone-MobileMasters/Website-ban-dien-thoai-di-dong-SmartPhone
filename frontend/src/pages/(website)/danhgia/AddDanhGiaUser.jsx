import React, { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { Form, Input, Button, Rate, message, Upload, Space, Card } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { createDanhGia, uploadImage, fetchOrdersByUserId } from '../../../service/api';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const AddDanhGiaUser = () => {
  const [loading, setLoading] = useState(false);
  const [hinhAnh1, setHinhAnh1] = useState(null);
  const [hinhAnh2, setHinhAnh2] = useState(null);
  const [hinhAnh3, setHinhAnh3] = useState(null);
  const [order, setOrder] = useState(null); // Lưu thông tin đơn hàng
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { id: orderId } = useParams();

  const bannedWords = ["lừa đảo", "chiếm đoạt", "ăn cắp", "bốc phét"];
  const normalizeText = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const containsBannedWords = (text) => bannedWords.some(word => normalizeText(text).includes(normalizeText(word)));

  // Lấy thông tin đơn hàng dựa trên orderId
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData.id) {
          const response = await fetchOrdersByUserId(userData.id);
          const orders = response.data.data;
          const foundOrder = orders.find((o) => o._id === orderId);
          if (foundOrder) {
            setOrder(foundOrder);
            // Tự động điền tên khách hàng vào form
            form.setFieldsValue({ Ten: foundOrder.shippingInfo.name });
          } else {
            message.error("Không tìm thấy đơn hàng!");
            navigate('/profile-receipt');
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
        message.error("Không thể tải thông tin đơn hàng!");
      }
    };

    // Kiểm tra xem đơn hàng đã được đánh giá chưa
    const reviewedOrders = JSON.parse(localStorage.getItem('reviewedOrders') || '{}');
    if (reviewedOrders[orderId]) {
      message.error("Đơn hàng này đã được đánh giá trước đó!");
      navigate('/profile-receipt');
    } else {
      fetchOrderData();
    }
  }, [orderId, navigate, form]);

  const handleImageUpload = async (file, setHinhAnh) => {
    if (!file) return false;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await uploadImage(formData);
      const imageUrl = response.data.imageUrl;
      setHinhAnh(imageUrl);
      message.success("Tải ảnh thành công!");
      return false;
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      message.error("Tải ảnh thất bại!");
      return false;
    }
  };

  const onFinish = async (values) => {
    if (containsBannedWords(values.NoiDung)) {
      message.error("Nội dung chứa từ ngữ không hợp lệ, vui lòng nhập lại!");
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      confirmAlert({
        title: 'Yêu cầu đăng nhập',
        message: 'Bạn cần đăng nhập để thêm đánh giá!',
        buttons: [
          { label: 'Đăng nhập ngay', onClick: () => navigate('/login') },
          { label: 'Hủy', onClick: () => {} }
        ]
      });
      return;
    }

    try {
      setLoading(true);
      const danhGiaData = {
        Ten: values.Ten,
        SanPham: order.products.map(p => p.name).join(', '), // Gộp tên sản phẩm
        NoiDung: values.NoiDung,
        DanhGia: values.DanhGia,
        orderId,
        HinhAnh1: hinhAnh1,
        HinhAnh2: hinhAnh2,
        HinhAnh3: hinhAnh3,
        isApproved: false,
      };

      await createDanhGia(danhGiaData);
      message.success("Đánh giá của bạn đã được gửi và đang chờ phê duyệt!");
      form.resetFields();
      setHinhAnh1(null);
      setHinhAnh2(null);
      setHinhAnh3(null);

      const reviewedOrders = JSON.parse(localStorage.getItem('reviewedOrders') || '{}');
      reviewedOrders[orderId] = true;
      localStorage.setItem('reviewedOrders', JSON.stringify(reviewedOrders));

      navigate('/listdanhgiauser');
    } catch (error) {
      console.error("Lỗi khi thêm đánh giá:", error);
      message.error("Thêm đánh giá thất bại, thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '20px' }}>
      <Card
        title={<h2 style={{ textAlign: 'center', margin: 0 }}>Thêm Đánh Giá</h2>}
        style={{ maxWidth: '800px', width: '100%', margin: '0 auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ padding: '0 20px' }}
        >
          <Form.Item
            label="Tên khách hàng"
            name="Ten"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input size="large" placeholder="Nhập tên của bạn" disabled />
          </Form.Item>

          <Form.Item label="Sản phẩm">
            <div>
              {order.products.map((product, index) => (
                <p key={index} className="font-medium">
                  {product.name} ({product.memory} - {product.color})
                </p>
              ))}
            </div>
          </Form.Item>

          <Form.Item
            label="Nội dung đánh giá"
            name="NoiDung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <Input.TextArea
              size="large"
              placeholder="Nhập nội dung đánh giá"
              rows={4}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            label="Xếp hạng"
            name="DanhGia"
            rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
          >
            <Rate style={{ fontSize: '24px' }} />
          </Form.Item>

          <Space direction="vertical" style={{ width: '100%' }}>
            {[1, 2, 3].map((index) => (
              <Form.Item key={index} label={`Hình ảnh ${index}`}>
                <Upload
                  beforeUpload={(file) => handleImageUpload(file, index === 1 ? setHinhAnh1 : index === 2 ? setHinhAnh2 : setHinhAnh3)}
                  showUploadList={false}
                >
                  <Button size="large" icon={<UploadOutlined />}>
                    Chọn hình ảnh
                  </Button>
                </Upload>
                {index === 1 && hinhAnh1 && (
                  <div style={{ marginTop: 10 }}>
                    <img src={hinhAnh1} alt="Hình ảnh 1" style={{ maxWidth: '150px', borderRadius: '4px' }} />
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => setHinhAnh1(null)}
                      style={{ color: '#ff4d4f', marginLeft: '10px' }}
                    >
                      Xóa
                    </Button>
                  </div>
                )}
                {index === 2 && hinhAnh2 && (
                  <div style={{ marginTop: 10 }}>
                    <img src={hinhAnh2} alt="Hình ảnh 2" style={{ maxWidth: '150px', borderRadius: '4px' }} />
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => setHinhAnh2(null)}
                      style={{ color: '#ff4d4f', marginLeft: '10px' }}
                    >
                      Xóa
                    </Button>
                  </div>
                )}
                {index === 3 && hinhAnh3 && (
                  <div style={{ marginTop: 10 }}>
                    <img src={hinhAnh3} alt="Hình ảnh 3" style={{ maxWidth: '150px', borderRadius: '4px' }} />
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => setHinhAnh3(null)}
                      style={{ color: '#ff4d4f', marginLeft: '10px' }}
                    >
                      Xóa
                    </Button>
                  </div>
                )}
              </Form.Item>
            ))}
          </Space>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{ width: '100%', borderRadius: '4px' }}
            >
              Thêm đánh giá
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddDanhGiaUser;