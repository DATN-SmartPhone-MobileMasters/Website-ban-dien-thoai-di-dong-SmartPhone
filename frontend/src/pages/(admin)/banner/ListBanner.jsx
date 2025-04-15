import React, { useState, useEffect } from 'react';
import { Spin, Alert, Typography, Modal, Upload, Button, message, Card, Row, Col } from 'antd';
import { UploadOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { fetchBanners, updateBanner, uploadImage } from '../../../service/api';

const { Title } = Typography;

const ListBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [bannerField, setBannerField] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [hiddenBanners, setHiddenBanners] = useState({}); // Trạng thái ẩn/hiển thị của từng banner
  const [emptyBanners, setEmptyBanners] = useState([]); // Danh sách banner không có ảnh
  const [nextToggleIndex, setNextToggleIndex] = useState(0); // Chỉ số để toggle tuần tự

  useEffect(() => {
    const loadBanners = async () => {
      try {
        setLoading(true);
        const response = await fetchBanners();
        console.log('Dữ liệu từ fetchBanners:', response.data);

        const bannerData = Array.isArray(response.data) ? response.data : [];
        setBanners(bannerData);
        setLoading(false);

        // Khởi tạo trạng thái ẩn/hiển thị và danh sách banner không có ảnh
        const initialHiddenState = {};
        const emptyBannerList = [];
        const bannerFields = ['Banner1', 'Banner2', 'Banner3', 'Banner4', 'Banner5', 'Banner6', 'Banner7', 'Banner8', 'Banner9', 'Banner10'];

        if (bannerData && bannerData.length > 0) {
          bannerFields.forEach((field) => {
            const bannerId = `${bannerData[0]._id}-${field}`;
            initialHiddenState[bannerId] = false; // Mặc định không ẩn
            if (!bannerData[0][field]) {
              emptyBannerList.push(bannerId); // Thêm vào danh sách banner không có ảnh
            }
          });
        }
        setHiddenBanners(initialHiddenState);
        setEmptyBanners(emptyBannerList);
      } catch (err) {
        console.error('Lỗi khi tải banner:', err.response || err);
        setError('Không thể tải danh sách banner.');
        setLoading(false);
      }
    };

    loadBanners();
  }, []);

  const checkActiveBanners = () => {
    return banners.reduce((count, banner) => {
      return (
        count +
        ['Banner1', 'Banner2', 'Banner3', 'Banner4', 'Banner5', 'Banner6', 'Banner7', 'Banner8', 'Banner9', 'Banner10'].filter(
          (field) => banner[field]
        ).length
      );
    }, 0);
  };

  // Đếm số lượng banner đang hiển thị
  const countVisibleBanners = () => {
    const bannerFields = ['Banner1', 'Banner2', 'Banner3', 'Banner4', 'Banner5', 'Banner6', 'Banner7', 'Banner8', 'Banner9', 'Banner10'];
    let visibleCount = 0;

    if (banners && banners.length > 0) {
      bannerFields.forEach((field) => {
        const bannerId = `${banners[0]._id}-${field}`;
        if (!hiddenBanners[bannerId]) {
          visibleCount++;
        }
      });
    }
    return visibleCount;
  };

  const handleImageClick = (record, field) => {
    setSelectedBanner(record);
    setBannerField(field);
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleHideBanner = async (record, field) => {
    if (checkActiveBanners() <= 1) {
      message.error('Phải có ít nhất một banner hiển thị!');
      return;
    }

    try {
      setLoading(true);
      const updatedData = { [field]: null };

      console.log('Dữ liệu gửi lên updateBanner:', {
        id: record._id,
        data: updatedData,
      });

      await updateBanner(record._id, updatedData);

      const response = await fetchBanners();
      const bannerData = Array.isArray(response.data) ? response.data : [];
      setBanners(bannerData);

      // Cập nhật lại danh sách banner không có ảnh và ẩn banner vừa xóa
      const emptyBannerList = [];
      const bannerFields = ['Banner1', 'Banner2', 'Banner3', 'Banner4', 'Banner5', 'Banner6', 'Banner7', 'Banner8', 'Banner9', 'Banner10'];
      const bannerId = `${record._id}-${field}`;
      const updatedHiddenBanners = { ...hiddenBanners, [bannerId]: true }; // Ẩn banner vừa xóa

      if (bannerData && bannerData.length > 0) {
        bannerFields.forEach((field) => {
          const bannerId = `${bannerData[0]._id}-${field}`;
          if (!bannerData[0][field]) {
            emptyBannerList.push(bannerId);
          }
        });
      }
      setHiddenBanners(updatedHiddenBanners);
      setEmptyBanners(emptyBannerList);

      // Cập nhật lại nextToggleIndex để đảm bảo không bị lỗi
      const currentIndex = emptyBanners.findIndex((id) => id === bannerId);
      if (currentIndex !== -1 && currentIndex <= nextToggleIndex) {
        setNextToggleIndex((prev) => Math.max(0, prev - 1));
      }

      message.success('Ẩn banner thành công!');
      setLoading(false);
    } catch (err) {
      console.error('Lỗi khi ẩn banner:', err.response || err);
      message.error(`Không thể ẩn banner: ${err.message || 'Lỗi không xác định'}`);
      setLoading(false);
    }
  };

  const handleHideSingleBanner = (bannerId) => {
    setHiddenBanners((prev) => ({
      ...prev,
      [bannerId]: true,
    }));

    // Cập nhật lại nextToggleIndex nếu cần
    const currentIndex = emptyBanners.findIndex((id) => id === bannerId);
    if (currentIndex !== -1 && currentIndex <= nextToggleIndex) {
      setNextToggleIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleShowNextEmptyBanner = () => {
    if (emptyBanners.length === 0) {
      message.info('Không có banner trống để hiển thị!');
      return;
    }

    // Lấy bannerId tại vị trí nextToggleIndex
    const bannerId = emptyBanners[nextToggleIndex];
    setHiddenBanners((prev) => ({
      ...prev,
      [bannerId]: false, // Hiển thị banner
    }));

    // Cập nhật chỉ số cho lần toggle tiếp theo
    setNextToggleIndex((prevIndex) => (prevIndex + 1) % emptyBanners.length);
  };

  const handleModalOk = async () => {
    if (fileList.length === 0) {
      message.error('Vui lòng chọn một ảnh!');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', fileList[0].originFileObj);
      console.log('Đang upload ảnh...');
      const uploadResponse = await uploadImage(formData);
      console.log('Response từ uploadImage:', uploadResponse.data);

      const newImageUrl = uploadResponse.data.url || uploadResponse.data.imageUrl;
      if (!newImageUrl) {
        throw new Error('Không tìm thấy URL ảnh trong response.');
      }
      console.log('URL ảnh mới:', newImageUrl);

      const updatedData = { [bannerField]: newImageUrl };
      console.log('Dữ liệu gửi lên updateBanner:', {
        id: selectedBanner._id,
        data: updatedData,
      });

      const updateResponse = await updateBanner(selectedBanner._id, updatedData);
      console.log('Response từ updateBanner:', updateResponse.data);

      const response = await fetchBanners();
      const bannerData = Array.isArray(response.data) ? response.data : [];
      setBanners(bannerData);

      // Cập nhật lại danh sách banner không có ảnh
      const emptyBannerList = [];
      const bannerFields = ['Banner1', 'Banner2', 'Banner3', 'Banner4', 'Banner5', 'Banner6', 'Banner7', 'Banner8', 'Banner9', 'Banner10'];
      if (bannerData && bannerData.length > 0) {
        bannerFields.forEach((field) => {
          const bannerId = `${bannerData[0]._id}-${field}`;
          if (!bannerData[0][field]) {
            emptyBannerList.push(bannerId);
          }
        });
      }
      setEmptyBanners(emptyBannerList);

      // Hiển thị lại banner vừa được tải ảnh
      const bannerId = `${selectedBanner._id}-${bannerField}`;
      setHiddenBanners((prev) => ({
        ...prev,
        [bannerId]: false, // Đảm bảo banner hiển thị sau khi tải ảnh
      }));

      message.success('Cập nhật banner thành công!');
      setIsModalVisible(false);
      setLoading(false);
    } catch (err) {
      console.error('Lỗi khi cập nhật banner:', err.response || err);
      message.error(`Không thể cập nhật banner: ${err.message || 'Lỗi không xác định'}`);
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setFileList([]);
  };

  const renderBanner = (banner, field, index) => {
    const url = banner[field];
    const hasImage = !!url;
    const bannerId = `${banner._id}-${field}`;
    const isHidden = hiddenBanners[bannerId] || false;

    // Nếu banner không có ảnh và bị ẩn, không render
    if (!hasImage && isHidden) {
      return null;
    }

    return (
      <div style={{ marginBottom: '2rem' }}>
        <Card
          key={bannerId}
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Banner {index + 1}</span>
              {!hasImage && (
                <Button
                  size="small"
                  icon={<EyeInvisibleOutlined />}
                  onClick={() => handleHideSingleBanner(bannerId)}
                >
                  Xóa bỏ
                </Button>
              )}
            </div>
          }
          style={{
            marginBottom: '1rem',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col span={24}>
              {hasImage ? (
                <div
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                  onClick={() => handleImageClick(banner, field)}
                >
                  <img
                    src={url}
                    alt={`Banner ${index + 1}`}
                    style={{
                      width: '100%',
                      maxWidth: '800px',
                      height: 'auto',
                      maxHeight: '300px',
                      objectFit: 'contain',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<UploadOutlined />}
                    onClick={() => handleImageClick(banner, field)}
                  >
                    Tải ảnh Banner {index + 1}
                  </Button>
                </div>
              )}
            </Col>
            {hasImage && (
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button
                  type="danger"
                  size="large"
                  onClick={() => handleHideBanner(banner, field)}
                >
                  Xóa Banner
                </Button>
              </Col>
            )}
          </Row>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Spin size="large" tip="Đang tải banner..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Title level={2}>Danh sách Banner</Title>
      {banners.map((banner) =>
        ['Banner1', 'Banner2', 'Banner3', 'Banner4', 'Banner5', 'Banner6', 'Banner7', 'Banner8', 'Banner9', 'Banner10'].map(
          (field, index) => renderBanner(banner, field, index)
        )
      )}
      {countVisibleBanners() < 10 && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Button
            size="large"
            icon={<EyeOutlined />}
            onClick={handleShowNextEmptyBanner}
          >
            Thêm Banner
          </Button>
        </div>
      )}
      <Modal
        title={`Cập nhật ${bannerField}`}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          beforeUpload={() => false}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default ListBanner;