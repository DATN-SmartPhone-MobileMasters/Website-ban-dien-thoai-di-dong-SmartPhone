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
import io from "socket.io-client";

const { Title, Text } = Typography;
const { Option } = Select;

// Kết nối Socket.IO
const socket = io("http://localhost:5000", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ["websocket", "polling"],
});

const ProductsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [product, setProduct] = useState({});
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [quantityErrors, setQuantityErrors] = useState({});
  const [priceErrors, setPriceErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

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

  useEffect(() => {
    setLoading(true);
    Promise.all([getProducts(id), fetchBrands()])
      .then(([productRes, brandsRes]) => {
        const productData = productRes.data.data;
        setProduct(productData);
        form.setFieldsValue(productData);
        setBrands(brandsRes.data.data);
        validateQuantities(productData);
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

  const onFinish = async (values) => {
    try {
      const updatedProduct = await updateProducts(id, values);
      message.success("Cập nhật sản phẩm thành công!");
      socket.emit("productUpdated", updatedProduct.data.data);
      navigate("/admin/products");
    } catch (error) {
      setError("Có lỗi xảy ra khi cập nhật sản phẩm.");
      message.error("Cập nhật sản phẩm thất bại!");
    }
  };

  const handleStatusChange = (value) => {
    const updatedFields = {};
    if (value === "Hết hàng") {
      // Chỉ đặt số lượng về 0, giữ nguyên giá
      for (let i = 1; i <= 6; i++) {
        updatedFields[`SoLuong${i}`] = 0;
      }
    } else {
      // Khi chuyển sang Còn hàng, đặt số lượng về 1 nếu đang là 0
      for (let i = 1; i <= 6; i++) {
        if (product[`SoLuong${i}`] === 0 && product[`BoNhoTrong${i}`] !== "Không có") {
          updatedFields[`SoLuong${i}`] = 1;
        }
      }
    }
    form.setFieldsValue(updatedFields);
    setProduct((prev) => ({
      ...prev,
      TrangThai: value,
      ...updatedFields,
    }));
    validateQuantities({ ...product, TrangThai: value, ...updatedFields });
  };

  const handleMemoryChange = (version, value) => {
    const updatedProduct = { ...product, [`BoNhoTrong${version}`]: value };
    if (value === "Không có") {
      updatedProduct[`GiaSP${version}`] = 0;
      updatedProduct[`SoLuong${version}`] = 0;
      form.setFieldsValue({
        [`GiaSP${version}`]: 0,
        [`SoLuong${version}`]: 0,
      });
      setQuantityErrors((prev) => ({
        ...prev,
        [`SoLuong${version}`]: null,
      }));
      setPriceErrors((prev) => ({
        ...prev,
        [`GiaSP${version}`]: null,
      }));
    } else {
      updatedProduct[`GiaSP${version}`] = product[`GiaSP${version}`] || "";
      updatedProduct[`SoLuong${version}`] = product[`SoLuong${version}`] || (product.TrangThai === "Còn hàng" ? 1 : 0);
      form.setFieldsValue({
        [`GiaSP${version}`]: product[`GiaSP${version}`] || "",
        [`SoLuong${version}`]: product[`SoLuong${version}`] || (product.TrangThai === "Còn hàng" ? 1 : 0),
      });
      validateQuantity(version, product[`SoLuong${version}`] || (product.TrangThai === "Còn hàng" ? 1 : 0));
      validatePrice(version, product[`GiaSP${version}`] || 0);
    }
    setProduct(updatedProduct);
    validateQuantities(updatedProduct);
  };

  const handleQuantityChange = (version, value) => {
    const updatedProduct = { ...product, [`SoLuong${version}`]: value };
    setProduct(updatedProduct);
    validateQuantity(version, value);
    validateQuantities(updatedProduct);
  };

  const handlePriceChange = (version, value) => {
    const updatedProduct = { ...product, [`GiaSP${version}`]: value };
    setProduct(updatedProduct);
    validatePrice(version, value);
    validateQuantities(updatedProduct);
  };

  const validateQuantity = (version, value) => {
    if (
      product.TrangThai === "Còn hàng" &&
      Number(value) === 0 &&
      product[`BoNhoTrong${version}`] !== "Không có"
    ) {
      setQuantityErrors((prev) => ({
        ...prev,
        [`SoLuong${version}`]: "Số lượng không thể là 0 khi còn hàng!",
      }));
    } else {
      setQuantityErrors((prev) => ({
        ...prev,
        [`SoLuong${version}`]: null,
      }));
    }
  };

  const validatePrice = (version, value) => {
    if (
      product.TrangThai === "Còn hàng" &&
      Number(value) === 0 &&
      product[`BoNhoTrong${version}`] !== "Không có"
    ) {
      setPriceErrors((prev) => ({
        ...prev,
        [`GiaSP${version}`]: "Giá không thể là 0 khi còn hàng!",
      }));
    } else {
      setPriceErrors((prev) => ({
        ...prev,
        [`GiaSP${version}`]: null,
      }));
    }
  };

  const validateQuantities = (currentProduct) => {
    const quantities = [
      currentProduct.SoLuong1 || 0,
      currentProduct.SoLuong2 || 0,
      currentProduct.SoLuong3 || 0,
      currentProduct.SoLuong4 || 0,
      currentProduct.SoLuong5 || 0,
      currentProduct.SoLuong6 || 0,
    ];
    const prices = [
      currentProduct.GiaSP1 || 0,
      currentProduct.GiaSP2 || 0,
      currentProduct.GiaSP3 || 0,
      currentProduct.GiaSP4 || 0,
      currentProduct.GiaSP5 || 0,
      currentProduct.GiaSP6 || 0,
    ];
    let hasError = false;

    if (currentProduct.TrangThai === "Còn hàng") {
      for (let i = 1; i <= 6; i++) {
        const memory = currentProduct[`BoNhoTrong${i}`];
        const quantity = Number(quantities[i - 1]);
        const price = Number(prices[i - 1]);

        if (memory !== "Không có" && quantity === 0) {
          hasError = true;
          setQuantityErrors((prev) => ({
            ...prev,
            [`SoLuong${i}`]: "Số lượng không thể là 0 khi còn hàng!",
          }));
        } else {
          setQuantityErrors((prev) => ({
            ...prev,
            [`SoLuong${i}`]: null,
          }));
        }

        if (memory !== "Không có" && price === 0) {
          hasError = true;
          setPriceErrors((prev) => ({
            ...prev,
            [`GiaSP${i}`]: "Giá không thể là 0 khi còn hàng!",
          }));
        } else {
          setPriceErrors((prev) => ({
            ...prev,
            [`GiaSP${i}`]: null,
          }));
        }
      }
    } else {
      setQuantityErrors({});
      setPriceErrors({});
    }

    setIsSubmitDisabled(hasError);
  };

  const getSelectedMemories = (currentVersion) => {
    const memories = [
      product.BoNhoTrong1,
      product.BoNhoTrong2,
      product.BoNhoTrong3,
      product.BoNhoTrong4,
      product.BoNhoTrong5,
      product.BoNhoTrong6,
    ];
    return memories
      .map((memory, index) => (index + 1 !== currentVersion ? memory : null))
      .filter((memory) => memory && memory !== "Không có" && memory !== "");
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

            {Array.from({ length: 6 }, (_, index) => {
              const version = index + 1;
              const selectedMemories = getSelectedMemories(version);
              return (
                <Col xs={24} key={version}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label={`Bộ Nhớ Trong ${version}`}
                        name={`BoNhoTrong${version}`}
                        rules={[{ required: false }]}
                      >
                        <Select
                          placeholder="Không có"
                          onChange={(value) => handleMemoryChange(version, value)}
                        >
                          {[
                            { value: "Không có", label: "Không có" },
                            { value: "32GB", label: "32GB" },
                            { value: "64GB", label: "64GB" },
                            { value: "128GB", label: "128GB" },
                            { value: "256GB", label: "256GB" },
                            { value: "512GB", label: "512GB" },
                            { value: "1TB", label: "1TB" },
                          ].map((option) => (
                            <Option
                              key={option.value}
                              value={option.value}
                              disabled={selectedMemories.includes(option.value) && option.value !== "Không có"}
                            >
                              {option.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label={`Số Lượng Bộ Nhớ Trong ${version}`}
                        name={`SoLuong${version}`}
                        rules={[
                          {
                            required: product[`BoNhoTrong${version}`] !== "Không có" && product.TrangThai === "Còn hàng",
                            message: "Vui lòng nhập số lượng!",
                          },
                          { validator: noNegativeNumber },
                        ]}
                        validateStatus={quantityErrors[`SoLuong${version}`] ? "error" : ""}
                        help={quantityErrors[`SoLuong${version}`]}
                      >
                        <Input
                          type="number"
                          placeholder="Nhập số lượng"
                          disabled={
                            product.TrangThai === "Hết hàng" || product[`BoNhoTrong${version}`] === "Không có"
                          }
                          onChange={(e) => handleQuantityChange(version, e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label={`Giá ${version}`}
                        name={`GiaSP${version}`}
                        rules={[
                          {
                            required: product[`BoNhoTrong${version}`] !== "Không có" && product.TrangThai === "Còn hàng",
                            message: "Vui lòng nhập giá!",
                          },
                          { validator: noNegativeNumber },
                        ]}
                        validateStatus={priceErrors[`GiaSP${version}`] ? "error" : ""}
                        help={priceErrors[`GiaSP${version}`]}
                      >
                        <Input
                          type="number"
                          placeholder={`Nhập giá sản phẩm ${version}`}
                          disabled={product[`BoNhoTrong${version}`] === "Không có"}
                          onChange={(e) => handlePriceChange(version, e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              );
            })}
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
          <Button type="primary" htmlType="submit" block disabled={isSubmitDisabled}>
            Cập Nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductsEdit;