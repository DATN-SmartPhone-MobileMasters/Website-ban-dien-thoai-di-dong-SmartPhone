import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProducts, updateProducts, fetchBrands, uploadImage } from "../../../service/api";
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Card,
  Spin,
  Alert,
  Typography,
  Space,
  Upload,
  message,
} from "antd";
import { LeftOutlined, UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const ProductsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [product, setProduct] = useState({});
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validators
  const noWhitespace = (_, value) => {
    if (!value || value.trim() === "") {
      return Promise.reject(new Error("Không được bỏ trống hoặc chỉ chứa khoảng trắng!"));
    }
    return Promise.resolve();
  };

  const noEmpty = (_, value) => {
    if (!value || value.trim() === "") {
      return Promise.reject(new Error("Không được bỏ trống!"));
    }
    return Promise.resolve();
  };

  const noNegativeNumber = (_, value) => {
    if (value === "" || value === undefined || value === null) {
      return Promise.reject(new Error("Không được bỏ trống!"));
    }
    if (isNaN(value) || Number(value) < 0) {
      return Promise.reject(new Error("Giá trị phải là số không âm!"));
    }
    if (/\s/.test(value)) {
      return Promise.reject(new Error("Không được chứa khoảng trắng!"));
    }
    return Promise.resolve();
  };

  const atLeastOneQuantityGreaterThanZero = () => ({
    validator(_, values) {
      if (values.TrangThai === "Còn hàng") {
        const quantities = [values.SoLuong1, values.SoLuong2, values.SoLuong3];
        if (quantities.every((q) => Number(q) === 0)) {
          return Promise.reject(new Error("Khi còn hàng, ít nhất một số lượng phải lớn hơn 0!"));
        }
      }
      return Promise.resolve();
    },
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([getProducts(id), fetchBrands()])
      .then(([productRes, brandsRes]) => {
        const productData = productRes.data.data;
        setProduct(productData);
        form.setFieldsValue(productData);
        setBrands(brandsRes.data.data);
      })
      .catch(() => setError("Không thể tải dữ liệu sản phẩm hoặc thương hiệu."))
      .finally(() => setLoading(false));
  }, [id, form]);

  const handleImageUpload = async (file, fieldName) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await uploadImage(formData);
      setProduct((prev) => ({
        ...prev,
        [fieldName]: response.data.imageUrl,
      }));
      form.setFieldsValue({ [fieldName]: response.data.imageUrl });
      message.success(`Tải ảnh ${fieldName} thành công!`);
      return false;
    } catch (error) {
      message.error(`Tải ảnh ${fieldName} thất bại!`);
      return false;
    }
  };

  const onFinish = (values) => {
    updateProducts(id, values)
      .then(() => {
        message.success("Cập nhật sản phẩm thành công!");
        navigate("/admin/products");
        // Phát sự kiện để thông báo Cart cập nhật
        window.dispatchEvent(new Event("cartUpdated"));
      })
      .catch(() => setError("Có lỗi xảy ra khi cập nhật sản phẩm."));
  };

  const handleStatusChange = (value) => {
    if (value === "Hết hàng") {
      form.setFieldsValue({ SoLuong1: 0, SoLuong2: 0, SoLuong3: 0 });
    }
    setProduct((prev) => ({
      ...prev,
      TrangThai: value,
    }));
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
        <Text style={{ marginTop: 16, display: "block" }}>Đang tải dữ liệu...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
        style={{ margin: "20px auto", maxWidth: 600 }}
      />
    );
  }

  return (
    <div style={{ padding: "24px", background: "#f0f2f5" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>Chỉnh Sửa Sản Phẩm</Title>
        </Col>
        <Col>
          <Link to="/admin/products">
            <Button type="default" icon={<LeftOutlined />}>
              Quay lại
            </Button>
          </Link>
        </Col>
      </Row>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={product}
        validateTrigger="onSubmit"
      >
        <Card
          title={<Text strong>Thông Tin Cơ Bản</Text>}
          style={{ marginBottom: 24 }}
          headStyle={{ background: "#1890ff", color: "#fff" }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tên Sản Phẩm"
                name="TenSP"
                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }, { validator: noWhitespace }]}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Mã Sản Phẩm" name="MaSP">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Trạng Thái"
                name="TrangThai"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
              >
                <Select placeholder="Chọn trạng thái" onChange={handleStatusChange}>
                  <Option value="Còn hàng">Còn hàng</Option>
                  <Option value="Hết hàng">Hết hàng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card
          title={<Text strong>Phiên Bản Sản Phẩm</Text>}
          style={{ marginBottom: 24 }}
          headStyle={{ background: "#13c2c2", color: "#fff" }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Màu 1"
                name="Mau1"
                rules={[{ required: true, message: "Vui lòng nhập màu!" }, { validator: noWhitespace }]}
              >
                <Input
                  placeholder="Nhập màu"
                  addonAfter={
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: product.Mau1 || "#fff",
                        border: "1px solid #d9d9d9",
                        borderRadius: 4,
                      }}
                    />
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Bộ Nhớ Trong 1"
                    name="BoNhoTrong1"
                    rules={[{ required: true, message: "Vui lòng chọn bộ nhớ trong 1!" }]}
                  >
                    <Select placeholder="Chọn bộ nhớ">
                      <Option value="64GB">64GB</Option>
                      <Option value="128GB">128GB</Option>
                      <Option value="256GB">256GB</Option>
                      <Option value="512GB">512GB</Option>
                      <Option value="1TB">1TB</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Text>Số Lượng Bộ Nhớ Trong 1</Text>}
                    name="SoLuong1"
                    rules={[
                      { required: true, message: "Vui lòng nhập số lượng!" },
                      { validator: noNegativeNumber },
                      atLeastOneQuantityGreaterThanZero(),
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Nhập số lượng"
                      disabled={product.TrangThai === "Hết hàng"}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Giá 1"
                    name="GiaSP1"
                    rules={[
                      { required: true, message: "Vui lòng nhập giá!" },
                      { validator: noNegativeNumber },
                    ]}
                  >
                    <Input type="number" placeholder="Nhập giá sản phẩm 1" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col xs={24}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Bộ Nhớ Trong 2"
                    name="BoNhoTrong2"
                    rules={[{ required: true, message: "Vui lòng chọn bộ nhớ trong 2!" }]}
                  >
                    <Select placeholder="Chọn bộ nhớ">
                      <Option value="64GB">64GB</Option>
                      <Option value="128GB">128GB</Option>
                      <Option value="256GB">256GB</Option>
                      <Option value="512GB">512GB</Option>
                      <Option value="1TB">1TB</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Text>Số Lượng Bộ Nhớ Trong 2</Text>}
                    name="SoLuong2"
                    rules={[
                      { required: true, message: "Vui lòng nhập số lượng!" },
                      { validator: noNegativeNumber },
                      atLeastOneQuantityGreaterThanZero(),
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Nhập số lượng"
                      disabled={product.TrangThai === "Hết hàng"}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Giá 2"
                    name="GiaSP2"
                    rules={[
                      { required: true, message: "Vui lòng nhập giá!" },
                      { validator: noNegativeNumber },
                    ]}
                  >
                    <Input type="number" placeholder="Nhập giá sản phẩm 2" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col xs={24}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Bộ Nhớ Trong 3"
                    name="BoNhoTrong3"
                    rules={[{ required: true, message: "Vui lòng chọn bộ nhớ trong 3!" }]}
                  >
                    <Select placeholder="Chọn bộ nhớ">
                      <Option value="64GB">64GB</Option>
                      <Option value="128GB">128GB</Option>
                      <Option value="256GB">256GB</Option>
                      <Option value="512GB">512GB</Option>
                      <Option value="1TB">1TB</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Text>Số Lượng Bộ Nhớ Trong 3</Text>}
                    name="SoLuong3"
                    rules={[
                      { required: true, message: "Vui lòng nhập số lượng!" },
                      { validator: noNegativeNumber },
                      atLeastOneQuantityGreaterThanZero(),
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Nhập số lượng"
                      disabled={product.TrangThai === "Hết hàng"}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Giá 3"
                    name="GiaSP3"
                    rules={[
                      { required: true, message: "Vui lòng nhập giá!" },
                      { validator: noNegativeNumber },
                    ]}
                  >
                    <Input type="number" placeholder="Nhập giá sản phẩm 3" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        <Card
          title={<Text strong>Hình Ảnh Sản Phẩm</Text>}
          style={{ marginBottom: 24 }}
          headStyle={{ background: "#52c41a", color: "#fff" }}
        >
          <Row gutter={[16, 16]}>
            {["HinhAnh1", "HinhAnh2", "HinhAnh3", "HinhAnh4", "HinhAnh5", "HinhAnh6"].map(
              (field, index) => (
                <Col xs={24} md={12} key={field}>
                  <Form.Item label={`Hình Ảnh ${index + 1}`} name={field}>
                    <Upload
                      beforeUpload={(file) => handleImageUpload(file, field)}
                      showUploadList={false}
                      accept="image/*"
                    >
                      <Button icon={<UploadOutlined />}>Tải lên</Button>
                    </Upload>
                    {product[field] && (
                      <div style={{ marginTop: 8 }}>
                        <img
                          src={product[field]}
                          alt={`Preview ${index + 1}`}
                          style={{ maxWidth: 150, maxHeight: 150, borderRadius: 8 }}
                        />
                      </div>
                    )}
                  </Form.Item>
                </Col>
              )
            )}
          </Row>
        </Card>

        <Card
          title={<Text strong>Mô Tả Sản Phẩm</Text>}
          style={{ marginBottom: 24 }}
          headStyle={{ background: "#faad14", color: "#fff" }}
        >
          <Form.Item
            label="Mô Tả"
            name="MoTa"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }, { validator: noEmpty }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>
        </Card>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Cập Nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductsEdit;