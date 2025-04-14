import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProducts, fetchBrands, uploadImage } from "../../../service/api";
import { Form, Input, Select, Button, Upload, message, Card, Row, Col, Space, Divider } from 'antd';
import { UploadOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const { Option } = Select;

const ProductsAdd = () => {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [products, setProducts] = useState([
    {
      MaSP: '',
      Mau1: '',
      TrangThai: '',
      HinhAnh1: null,
      HinhAnh2: null,
      HinhAnh3: null,
      HinhAnh4: null,
      HinhAnh5: null,
      HinhAnh6: null,
      memoryData: [
        { BoNhoTrong: 'Vui lòng chọn bộ nhớ', GiaSP: '0', SoLuong: '0', isVisible: true },
        { BoNhoTrong: 'Vui lòng chọn bộ nhớ', GiaSP: '0', SoLuong: '0', isVisible: false },
        { BoNhoTrong: 'Vui lòng chọn bộ nhớ', GiaSP: '0', SoLuong: '0', isVisible: false },
        { BoNhoTrong: 'Vui lòng chọn bộ nhớ', GiaSP: '0', SoLuong: '0', isVisible: false },
        { BoNhoTrong: 'Vui lòng chọn bộ nhớ', GiaSP: '0', SoLuong: '0', isVisible: false },
        { BoNhoTrong: 'Vui lòng chọn bộ nhớ', GiaSP: '0', SoLuong: '0', isVisible: false },
      ],
      hiddenIndices: [],
    },
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const response = await fetchBrands();
        setBrands(response.data.data);
      } catch (err) {
        console.error('Lỗi khi tải thương hiệu:', err);
        setError('Không thể tải danh sách thương hiệu.');
      }
    };
    loadBrands();
  }, []);

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };
    setProducts(updatedProducts);
  };

  const toggleMemoryVisibility = (productIndex) => {
    const updatedProducts = [...products];
    const product = updatedProducts[productIndex];
    const visibleCount = product.memoryData.filter(data => data.isVisible).length;

    if (visibleCount < 6) {
      const nextHiddenIndex = product.hiddenIndices.length > 0 ? product.hiddenIndices[0] : visibleCount;
      if (nextHiddenIndex < 6) {
        product.memoryData[nextHiddenIndex].isVisible = true;
        product.hiddenIndices = product.hiddenIndices.filter(idx => idx !== nextHiddenIndex);
      }
    } else {
      const lastVisibleIndex = product.memoryData.reduce((maxIdx, data, idx) => 
        data.isVisible && idx > 0 ? idx : maxIdx, 0);
      product.memoryData[lastVisibleIndex].isVisible = false;
      product.hiddenIndices = [...product.hiddenIndices, lastVisibleIndex].sort((a, b) => a - b);
    }
    setProducts(updatedProducts);
  };

  const hideMemory = (productIndex, memoryIndex) => {
    const updatedProducts = [...products];
    const product = updatedProducts[productIndex];
    product.memoryData[memoryIndex] = {
      BoNhoTrong: 'Vui lòng chọn bộ nhớ',
      GiaSP: '0',
      SoLuong: '0',
      isVisible: false,
    };
    form.setFieldsValue({
      [`BoNhoTrong_${productIndex}_${memoryIndex}`]: 'Vui lòng chọn bộ nhớ',
      [`GiaSP_${productIndex}_${memoryIndex}`]: '0',
      [`SoLuong_${productIndex}_${memoryIndex}`]: '0',
    });
    product.hiddenIndices = [...product.hiddenIndices, memoryIndex].sort((a, b) => a - b);
    setProducts(updatedProducts);
  };

  const handleMemoryDataChange = (productIndex, memoryIndex, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].memoryData[memoryIndex] = {
      ...updatedProducts[productIndex].memoryData[memoryIndex],
      [field]: value,
    };
    if (field === 'BoNhoTrong' && value === 'Vui lòng chọn bộ nhớ') {
      updatedProducts[productIndex].memoryData[memoryIndex].GiaSP = '0';
      updatedProducts[productIndex].memoryData[memoryIndex].SoLuong = '0';
      form.setFieldsValue({
        [`GiaSP_${productIndex}_${memoryIndex}`]: '0',
        [`SoLuong_${productIndex}_${memoryIndex}`]: '0',
      });
    }
    if (field === 'BoNhoTrong' && value !== 'Vui lòng chọn bộ nhớ') {
      updatedProducts[productIndex].memoryData[memoryIndex].GiaSP = '';
      updatedProducts[productIndex].memoryData[memoryIndex].SoLuong = '';
      form.setFieldsValue({
        [`GiaSP_${productIndex}_${memoryIndex}`]: '',
        [`SoLuong_${productIndex}_${memoryIndex}`]: '',
      });
    }
    setProducts(updatedProducts);
  };

  const handleImageUpload = async (index, file, fieldName) => {
    if (!file) return false;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await uploadImage(formData);
      const imageUrl = response.data.imageUrl;
      handleProductChange(index, fieldName, imageUrl);
      message.success(`Tải ảnh ${fieldName} thành công!`);
      return false;
    } catch (error) {
      console.error(`Lỗi khi tải ${fieldName}:`, error);
      message.error(`Tải ảnh ${fieldName} thất bại`);
      setError(`Không thể tải ảnh ${fieldName}.`);
      return false;
    }
  };

  const handleAddForm = () => {
    const newProduct = {
      MaSP: '',
      Mau1: '',
      TrangThai: '',
      HinhAnh1: null,
      HinhAnh2: null,
      HinhAnh3: null,
      HinhAnh4: null,
      HinhAnh5: null,
      HinhAnh6: null,
      memoryData: [
        { BoNhoTrong: 'Vui lòng chọn bộ nhớ', GiaSP: '0', SoLuong: '0', isVisible: true },
        { BoNhoTrong: 'Vui lòng chọn bộ nhớ', GiaSP: '0', SoLuong: '0', isVisible: false },
        { BoNhoTrong: 'Vui lòng chọn bộ nhớ', GiaSP: '0', SoLuong: '0', isVisible: false },
        { BoNhoTrong: 'Vui lòng chọn bộ nhớ', GiaSP: '0', SoLuong: '0', isVisible: false },
        { BoNhoTrong: 'Vui lòng chọn bộ nhớ', GiaSP: '0', SoLuong: '0', isVisible: false },
        { BoNhoTrong: 'Vui lòng chọn bộ nhớ', GiaSP: '0', SoLuong: '0', isVisible: false },
      ],
      hiddenIndices: [],
    };
    setProducts([...products, newProduct]);
  };

  const handleRemoveForm = (index) => {
    if (index === 0) {
      message.warning('Không thể xóa form sản phẩm đầu tiên!');
      return;
    }
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const validateMemorySelection = (product) => {
    const hasSelectedMemory = product.memoryData.some(
      (data) => data.BoNhoTrong !== 'Vui lòng chọn bộ nhớ'
    );
    if (!hasSelectedMemory) {
      throw new Error('Phải chọn ít nhất một bộ nhớ cho sản phẩm!');
    }
  };

  const validateImages = (product, index) => {
    const images = [
      { field: 'HinhAnh1', label: 'Hình ảnh 1' },
      { field: 'HinhAnh2', label: 'Hình ảnh 2' },
      { field: 'HinhAnh3', label: 'Hình ảnh 3' },
      { field: 'HinhAnh4', label: 'Hình ảnh 4' },
      { field: 'HinhAnh5', label: 'Hình ảnh 5' },
      { field: 'HinhAnh6', label: 'Hình ảnh 6' },
    ];
    for (const img of images) {
      if (!product[img.field]) {
        throw new Error(`${img.label} của sản phẩm ${index + 1} không được để trống!`);
      }
    }
  };

  const handleAddAllProducts = async () => {
    setLoading(true);
    setError('');
    try {
      await form.validateFields();
      const mainValues = form.getFieldsValue();
      for (let i = 0; i < products.length; i++) {
        const product = products[i];

        validateImages(product, i);
        validateMemorySelection(product);

        const productToAdd = {
          ...product,
          TenSP: mainValues.TenSP,
          TenTH: mainValues.TenTH,
          MoTa: mainValues.MoTa,
          CamTruoc: mainValues.CamTruoc,
          CamSau: mainValues.CamSau,
          HDH: mainValues.HDH,
          LoaiPin: mainValues.LoaiPin,
          CapSac: mainValues.CapSac,
          ...product.memoryData.reduce((acc, data, i) => ({
            ...acc,
            [`BoNhoTrong${i + 1}`]: data.BoNhoTrong === 'Vui lòng chọn bộ nhớ' ? '' : data.BoNhoTrong,
            [`GiaSP${i + 1}`]: data.GiaSP,
            [`SoLuong${i + 1}`]: data.SoLuong,
          }), {}),
        };

        delete productToAdd.memoryData;
        delete productToAdd.hiddenIndices;

        await createProducts(productToAdd);
        message.success(`Thêm sản phẩm ${i + 1} thành công!`);
      }
      navigate('/admin/products');
      message.success('Thêm tất cả sản phẩm thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm tất cả sản phẩm:', error.response?.data || error);
      const errorMsg = error.response?.data?.message || error.message || 'Không thể thêm tất cả sản phẩm.';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const noWhitespace = (rule, value) => {
    if (!value || value.trim() === '') {
      return Promise.reject('Không được để trống hoặc chỉ nhập khoảng trắng!');
    }
    return Promise.resolve();
  };

  const noNegativeNumber = (rule, value) => {
    if (value && Number(value) < 0) {
      return Promise.reject('Không được nhập số âm!');
    }
    return Promise.resolve();
  };

  const atLeastOneQuantityGreaterThanZero = (productIndex) => ({
    validator(_, values) {
      if (values[`TrangThai_${productIndex}`] === "Còn hàng") {
        const quantities = products[productIndex].memoryData.map((data) => data.SoLuong);
        if (quantities.every((q) => !q || Number(q) === 0)) {
          return Promise.reject(new Error("Khi còn hàng, ít nhất một số lượng phải lớn hơn 0!"));
        }
      }
      return Promise.resolve();
    },
  });

  const validateDuplicateMaSP = (index) => ({
    validator(_, value) {
      if (!value) {
        return Promise.resolve();
      }
      const isDuplicate = products.some(
        (product, i) => i !== index && product.MaSP.trim() === value.trim()
      );
      if (isDuplicate) {
        return Promise.reject(new Error('Mã sản phẩm đã tồn tại ở form trên!'));
      }
      return Promise.resolve();
    },
  });

  const getSelectedMemories = (productIndex, currentMemoryIndex) => {
    return products[productIndex].memoryData
      .map((data, index) => (index !== currentMemoryIndex ? data.BoNhoTrong : null))
      .filter((memory) => memory && memory !== 'Vui lòng chọn bộ nhớ');
  };

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Thêm Sản Phẩm</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', fontSize: '16px' }}>{error}</div>
      )}

      <Form form={form} layout="vertical">
        <Card title="Thông Tin Cơ Bản" style={{ marginBottom: '30px', padding: '20px' }}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Tên Sản Phẩm (Chung)"
                name="TenSP"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }, { validator: noWhitespace }]}
              >
                <Input placeholder="Nhập tên sản phẩm" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Thương Hiệu"
                name="TenTH"
                rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
              >
                <Select placeholder="Chọn thương hiệu" size="large">
                  <Option value="">Chọn thương hiệu</Option>
                  {brands.map((brand) => (
                    <Option key={brand._id} value={brand.TenTH}>
                      {brand.TenTH}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Thông Số Kỹ Thuật" style={{ marginBottom: '30px', padding: '20px' }}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Mô Tả"
                name="MoTa"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }, { validator: noWhitespace }]}
              >
                <Input placeholder="Nhập mô tả sản phẩm" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Camera Trước"
                name="CamTruoc"
                rules={[{ required: true, message: 'Vui lòng chọn độ phân giải camera trước!' }]}
              >
                <Select placeholder="Chọn độ phân giải" size="large">
                  <Option value="">Chọn độ phân giải</Option>
                  <Option value="30px">30 PX</Option>
                  <Option value="35px">35 PX</Option>
                  <Option value="40px">40 PX</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Camera Sau"
                name="CamSau"
                rules={[{ required: true, message: 'Vui lòng chọn độ phân giải camera sau!' }]}
              >
                <Select placeholder="Chọn độ phân giải" size="large">
                  <Option value="">Chọn độ phân giải</Option>
                  <Option value="16px">16 PX</Option>
                  <Option value="20px">20 PX</Option>
                  <Option value="25px">25 PX</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="CPU"
                name="CPU"
                rules={[{ required: true, message: 'Vui lòng chọn loại CPU!' }]}
              >
                <Select placeholder="Chọn loại CPU" size="large">
                  <Option value="">Chọn loại CPU</Option>
                  <Option value="APPLE CHIPSET">APPLE CHIPSET</Option>
                  <Option value="ANDROID CHIPSET">ANDROID CHIPSET</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Màn Hình"
                name="ManHinh"
                rules={[{ required: true, message: 'Vui lòng chọn kích thước màn hình!' }]}
              >
                <Select placeholder="Chọn kích thước màn hình" size="large">
                  <Option value="">Chọn kích thước màn hình</Option>
                  <Option value="5inch">5 inch</Option>
                  <Option value="5.1inch">5.1 inch</Option>
                  <Option value="6inch">6 inch</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Hệ Điều Hành"
                name="HDH"
                rules={[{ required: true, message: 'Vui lòng chọn hệ điều hành!' }]}
              >
                <Select placeholder="Chọn hệ điều hành" size="large">
                  <Option value="">Chọn hệ điều hành</Option>
                  <Option value="IOS">IOS</Option>
                  <Option value="ANDROID">ANDROID</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Loại Pin"
                name="LoaiPin"
                rules={[{ required: true, message: 'Vui lòng chọn loại pin!' }]}
              >
                <Select placeholder="Chọn loại pin" size="large">
                  <Option value="">Chọn loại pin</Option>
                  <Option value="PISEN">PISEN</Option>
                  <Option value="Energizer">Energizer</Option>
                  <Option value="Duracell">Duracell</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Cáp Sạc"
                name="CapSac"
                rules={[{ required: true, message: 'Vui lòng chọn loại cáp sạc!' }]}
              >
                <Select placeholder="Chọn loại cáp" size="large">
                  <Option value="">Chọn loại cáp</Option>
                  <Option value="Type-C">Type-C</Option>
                  <Option value="Lightning">Lightning</Option>
                  <Option value="USB">USB</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Divider orientation="left">Danh Sách Sản Phẩm</Divider>

        {products.map((product, index) => (
          <Card
            key={index}
            title={`Form Sản Phẩm ${index + 1}`}
            style={{ marginBottom: '30px', padding: '20px' }}
            extra={
              index > 0 && (
                <Button
                  type="primary"
                  danger
                  onClick={() => handleRemoveForm(index)}
                  style={{ fontSize: '14px' }}
                >
                  Xóa Form
                </Button>
              )
            }
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item
                      label="Mã Sản Phẩm"
                      name={`MaSP_${index}`}
                      rules={[
                        { required: true, message: 'Vui lòng nhập mã sản phẩm!' },
                        { validator: noWhitespace },
                        validateDuplicateMaSP(index),
                      ]}
                    >
                      <Input
                        value={product.MaSP}
                        onChange={(e) => handleProductChange(index, 'MaSP', e.target.value)}
                        placeholder="Nhập mã sản phẩm"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="Trạng Thái"
                      name={`TrangThai_${index}`}
                      rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                      <Select
                        value={product.TrangThai}
                        onChange={(value) => handleProductChange(index, 'TrangThai', value)}
                        placeholder="Chọn trạng thái"
                        size="large"
                      >
                        <Option value="">Vui lòng chọn</Option>
                        <Option value="Còn hàng">Còn hàng</Option>
                        <Option value="Hết hàng">Hết hàng</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="Màu Sắc"
                      name={`Mau1_${index}`}
                      rules={[{ required: true, message: 'Vui lòng nhập màu sắc!' }, { validator: noWhitespace }]}
                    >
                      <Input
                        value={product.Mau1}
                        onChange={(e) => handleProductChange(index, 'Mau1', e.target.value)}
                        placeholder="Nhập màu sắc"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Card title="Bộ Nhớ, Giá và Số Lượng" style={{ marginBottom: '20px', padding: '10px' }}>
                  {product.memoryData.map((data, memoryIndex) => (
                    data.isVisible && (
                      <Row key={memoryIndex} gutter={[16, 16]} style={{ marginBottom: 16 }} align="middle">
                        <Col xs={24} md={8}>
                          <Form.Item
                            label={`Bộ Nhớ Trong ${memoryIndex + 1}`}
                            name={`BoNhoTrong_${index}_${memoryIndex}`}
                            rules={[{ required: false }]}
                            initialValue={data.BoNhoTrong}
                          >
                            <Select
                              placeholder="Vui lòng chọn bộ nhớ"
                              size="large"
                              onChange={(value) => handleMemoryDataChange(index, memoryIndex, 'BoNhoTrong', value)}
                            >
                              <Option value="Vui lòng chọn bộ nhớ">Vui lòng chọn bộ nhớ</Option>
                              {[
                                { value: '32GB', label: '32GB' },
                                { value: '64GB', label: '64GB' },
                                { value: '128GB', label: '128GB' },
                                { value: '256GB', label: '256GB' },
                                { value: '512GB', label: '512GB' },
                                { value: '1TB', label: '1TB' },
                              ].map((option) => {
                                const selectedMemories = getSelectedMemories(index, memoryIndex);
                                const isDisabled = selectedMemories.includes(option.value);
                                return (
                                  <Option key={option.value} value={option.value} disabled={isDisabled}>
                                    {option.label}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={memoryIndex === 0 ? 8 : 7}>
                          <Form.Item
                            label={`Giá Sản Phẩm ${memoryIndex + 1}`}
                            name={`GiaSP_${index}_${memoryIndex}`}
                            rules={[
                              { required: data.BoNhoTrong !== 'Vui lòng chọn bộ nhớ', message: 'Vui lòng nhập giá!' },
                              { validator: noNegativeNumber },
                            ]}
                            initialValue={data.GiaSP}
                          >
                            <Input
                              type="number"
                              placeholder="Nhập giá"
                              size="large"
                              disabled={data.BoNhoTrong === 'Vui lòng chọn bộ nhớ'}
                              onChange={(e) => handleMemoryDataChange(index, memoryIndex, 'GiaSP', e.target.value)}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={memoryIndex === 0 ? 8 : 7}>
                          <Form.Item
                            label={`Số Lượng ${memoryIndex + 1}`}
                            name={`SoLuong_${index}_${memoryIndex}`}
                            rules={[
                              { required: data.BoNhoTrong !== 'Vui lòng chọn bộ nhớ', message: 'Vui lòng nhập số lượng!' },
                              { validator: noNegativeNumber },
                              atLeastOneQuantityGreaterThanZero(index),
                            ]}
                            initialValue={data.SoLuong}
                          >
                            <Input
                              type="number"
                              placeholder="Nhập số lượng"
                              size="large"
                              disabled={data.BoNhoTrong === 'Vui lòng chọn bộ nhớ'}
                              onChange={(e) => handleMemoryDataChange(index, memoryIndex, 'SoLuong', e.target.value)}
                            />
                          </Form.Item>
                        </Col>
                        {memoryIndex > 0 && (
                          <Col xs={24} md={2}>
                            <Button
                              type="link"
                              icon={<EyeInvisibleOutlined />}
                              onClick={() => hideMemory(index, memoryIndex)}
                            >
                              Ẩn
                            </Button>
                          </Col>
                        )}
                      </Row>
                    )
                  ))}
                  <Button
                    type="link"
                    icon={product.memoryData.filter(data => data.isVisible).length < 6 ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    onClick={() => toggleMemoryVisibility(index)}
                    style={{ marginTop: 8 }}
                  >
                    Thêm bộ nhớ
                  </Button>
                </Card>
              </Col>

              <Col span={24}>
                <Card title="Hình Ảnh Sản Phẩm" style={{ padding: '10px' }}>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Form.Item
                        label="Hình Ảnh 1"
                        name={`HinhAnh1_${index}`}
                        valuePropName="file"
                        getValueFromEvent={() => product.HinhAnh1}
                      >
                        <Upload
                          beforeUpload={(file) => handleImageUpload(index, file, 'HinhAnh1')}
                          showUploadList={false}
                        >
                          <Button icon={<UploadOutlined />} size="large">
                            Tải lên
                          </Button>
                        </Upload>
                        {product.HinhAnh1 && (
                          <div style={{ marginTop: '10px' }}>
                            <img
                              src={product.HinhAnh1}
                              alt="Hình ảnh 1"
                              style={{ maxWidth: '100px', maxHeight: '100px', border: '1px solid #ddd' }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100?text=Error+Loading+Image';
                                console.error('Lỗi tải HinhAnh1:', product.HinhAnh1);
                              }}
                            />
                            <Button
                              type="link"
                              onClick={() => handleProductChange(index, 'HinhAnh1', null)}
                              style={{ marginLeft: '10px', color: 'red' }}
                            >
                              Xóa
                            </Button>
                          </div>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Hình Ảnh 2"
                        name={`HinhAnh2_${index}`}
                        valuePropName="file"
                        getValueFromEvent={() => product.HinhAnh2}
                      >
                        <Upload
                          beforeUpload={(file) => handleImageUpload(index, file, 'HinhAnh2')}
                          showUploadList={false}
                        >
                          <Button icon={<UploadOutlined />} size="large">
                            Tải lên
                          </Button>
                        </Upload>
                        {product.HinhAnh2 && (
                          <div style={{ marginTop: '10px' }}>
                            <img
                              src={product.HinhAnh2}
                              alt="Hình ảnh 2"
                              style={{ maxWidth: '100px', maxHeight: '100px', border: '1px solid #ddd' }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100?text=Error+Loading+Image';
                                console.error('Lỗi tải HinhAnh2:', product.HinhAnh2);
                              }}
                            />
                            <Button
                              type="link"
                              onClick={() => handleProductChange(index, 'HinhAnh2', null)}
                              style={{ marginLeft: '10px', color: 'red' }}
                            >
                              Xóa
                            </Button>
                          </div>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Hình Ảnh 3"
                        name={`HinhAnh3_${index}`}
                        valuePropName="file"
                        getValueFromEvent={() => product.HinhAnh3}
                      >
                        <Upload
                          beforeUpload={(file) => handleImageUpload(index, file, 'HinhAnh3')}
                          showUploadList={false}
                        >
                          <Button icon={<UploadOutlined />} size="large">
                            Tải lên
                          </Button>
                        </Upload>
                        {product.HinhAnh3 && (
                          <div style={{ marginTop: '10px' }}>
                            <img
                              src={product.HinhAnh3}
                              alt="Hình ảnh 3"
                              style={{ maxWidth: '100px', maxHeight: '100px', border: '1px solid #ddd' }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100?text=Error+Loading+Image';
                                console.error('Lỗi tải HinhAnh3:', product.HinhAnh3);
                              }}
                            />
                            <Button
                              type="link"
                              onClick={() => handleProductChange(index, 'HinhAnh3', null)}
                              style={{ marginLeft: '10px', color: 'red' }}
                            >
                              Xóa
                            </Button>
                          </div>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Hình Ảnh 4"
                        name={`HinhAnh4_${index}`}
                        valuePropName="file"
                        getValueFromEvent={() => product.HinhAnh4}
                      >
                        <Upload
                          beforeUpload={(file) => handleImageUpload(index, file, 'HinhAnh4')}
                          showUploadList={false}
                        >
                          <Button icon={<UploadOutlined />} size="large">
                            Tải lên
                          </Button>
                        </Upload>
                        {product.HinhAnh4 && (
                          <div style={{ marginTop: '10px' }}>
                            <img
                              src={product.HinhAnh4}
                              alt="Hình ảnh 4"
                              style={{ maxWidth: '100px', maxHeight: '100px', border: '1px solid #ddd' }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100?text=Error+Loading+Image';
                                console.error('Lỗi tải HinhAnh4:', product.HinhAnh4);
                              }}
                            />
                            <Button
                              type="link"
                              onClick={() => handleProductChange(index, 'HinhAnh4', null)}
                              style={{ marginLeft: '10px', color: 'red' }}
                            >
                              Xóa
                            </Button>
                          </div>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Hình Ảnh 5"
                        name={`HinhAnh5_${index}`}
                        valuePropName="file"
                        getValueFromEvent={() => product.HinhAnh5}
                      >
                        <Upload
                          beforeUpload={(file) => handleImageUpload(index, file, 'HinhAnh5')}
                          showUploadList={false}
                        >
                          <Button icon={<UploadOutlined />} size="large">
                            Tải lên
                          </Button>
                        </Upload>
                        {product.HinhAnh5 && (
                          <div style={{ marginTop: '10px' }}>
                            <img
                              src={product.HinhAnh5}
                              alt="Hình ảnh 5"
                              style={{ maxWidth: '100px', maxHeight: '100px', border: '1px solid #ddd' }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100?text=Error+Loading+Image';
                                console.error('Lỗi tải HinhAnh5:', product.HinhAnh5);
                              }}
                            />
                            <Button
                              type="link"
                              onClick={() => handleProductChange(index, 'HinhAnh5', null)}
                              style={{ marginLeft: '10px', color: 'red' }}
                            >
                              Xóa
                            </Button>
                          </div>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Hình Ảnh 6"
                        name={`HinhAnh6_${index}`}
                        valuePropName="file"
                        getValueFromEvent={() => product.HinhAnh6}
                      >
                        <Upload
                          beforeUpload={(file) => handleImageUpload(index, file, 'HinhAnh6')}
                          showUploadList={false}
                        >
                          <Button icon={<UploadOutlined />} size="large">
                            Tải lên
                          </Button>
                        </Upload>
                        {product.HinhAnh6 && (
                          <div style={{ marginTop: '10px' }}>
                            <img
                              src={product.HinhAnh6}
                              alt="Hình ảnh 6"
                              style={{ maxWidth: '100px', maxHeight: '100px', border: '1px solid #ddd' }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100?text=Error+Loading+Image';
                                console.error('Lỗi tải HinhAnh6:', product.HinhAnh6);
                              }}
                            />
                            <Button
                              type="link"
                              onClick={() => handleProductChange(index, 'HinhAnh6', null)}
                              style={{ marginLeft: '10px', color: 'red' }}
                            >
                              Xóa
                            </Button>
                          </div>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Card>
        ))}

        <Space style={{ marginTop: '30px', marginBottom: '20px' }}>
          <Button
            type="dashed"
            onClick={handleAddForm}
            size="large"
            style={{ width: '200px', fontSize: '16px' }}
          >
            Thêm Form Sản Phẩm
          </Button>
          <Button
            type="primary"
            onClick={handleAddAllProducts}
            loading={loading}
            size="large"
            style={{ width: '200px', fontSize: '16px' }}
          >
            {loading ? 'Đang thêm tất cả...' : 'Thêm Tất Cả Sản Phẩm'}
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default ProductsAdd;