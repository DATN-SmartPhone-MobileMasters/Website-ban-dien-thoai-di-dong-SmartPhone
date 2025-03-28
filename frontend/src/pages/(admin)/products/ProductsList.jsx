import React, { useEffect, useState } from "react";
import { fetchProducts, deleteProducts } from "../../../service/api";
import {
  message,
  Table,
  Button,
  Popconfirm,
  Input,
  Select,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Spin,
  Tooltip,
} from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import { PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title } = Typography;

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Lấy query params từ URL
  const { search = "", memory = "", status = "", brand = "" } = queryString.parse(location.search);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    filterProducts(search, memory, status, brand);
  }, [search, memory, status, brand, products]);

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts();
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setProducts(data);
      setFilteredProducts(data);

      // Tạo danh sách thương hiệu dựa vào chữ đầu tiên của TenSP, chuẩn hóa dữ liệu
      const uniqueBrands = [
        ...new Set(data.map((p) => p.TenSP.split(" ")[0].trim().toLowerCase()))
      ].map((brand) => brand.charAt(0).toUpperCase() + brand.slice(1));
      setBrands(uniqueBrands);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProducts(id);
      message.success("Xóa sản phẩm thành công!");
      getProducts();
    } catch (error) {
      message.error("Lỗi khi xóa sản phẩm!");
    }
  };

  const handleFilter = (value) => {
    updateURL({ search: value, memory, status, brand });
  };

  const handleMemoryFilter = (value) => {
    updateURL({ search, memory: value, status, brand });
  };

  const handleStatusFilter = (value) => {
    updateURL({ search, memory, status: value, brand });
  };

  const handleBrandFilter = (value) => {
    updateURL({ search, memory, status, brand: value });
  };

  const updateURL = (params) => {
    const query = queryString.stringify(params);
    navigate(`?${query}`, { replace: true });
  };

  const filterProducts = (search, memory, status, brand) => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter((p) => p.TenSP.toLowerCase().includes(search.toLowerCase()));
    }

    if (memory) {
      filtered = filtered.filter((p) => p.BoNhoTrong1 === memory);
    }

    if (status) {
      filtered = filtered.filter((p) => p.TrangThai === status);
    }

    if (brand) {
      filtered = filtered.filter((p) =>
        p.TenSP.split(" ")[0].trim().toLowerCase() === brand.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "TenSP",
      key: "TenSP",
      width: 250,
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
      sorter: (a, b) => a.TenSP.localeCompare(b.TenSP),
    },
    {
      title: "Bộ Nhớ",
      dataIndex: "BoNhoTrong1",
      key: "BoNhoTrong1",
      width: 100,
    },
    {
      title: "Trạng Thái",
      dataIndex: "TrangThai",
      key: "TrangThai",
      render: (status) => (
        <span style={{ color: status === "Còn hàng" ? "#52c41a" : "#ff4d4f" }}>
          {status}
        </span>
      ),
      width: 120,
    },
    {
      title: "Hình Ảnh",
      dataIndex: "HinhAnh1",
      key: "HinhAnh1",
      render: (text) => (
        <img
          src={text}
          alt="Hình ảnh sản phẩm"
          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
        />
      ),
      width: 80,
    },
    {
      title: "Màu Sắc",
      dataIndex: "Mau1",
      key: "Mau1",
      render: (color) => (
        <div
          style={{
            width: 30,
            height: 30,
            backgroundColor: color,
            borderRadius: 5,
            border: "1px solid #ddd",
          }}
        />
      ),
      width: 80,
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/products/${record._id}`}>
            <Button type="primary" icon={<EyeOutlined />} size="small">
              Xem
            </Button>
          </Link>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 150,
      fixed: "right",
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Danh Sách Sản Phẩm
          </Title>
        </Col>
        <Col>
          <Link to="/admin/products/add">
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm Sản Phẩm
            </Button>
          </Link>
        </Col>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6}>
            <Input
              placeholder="Nhập tên sản phẩm..."
              value={search}
              onChange={(e) => handleFilter(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Lọc theo thương hiệu"
              value={brand || undefined}
              onChange={handleBrandFilter}
              allowClear
              style={{ width: "100%" }}
            >
              {brands.map((b) => (
                <Option key={b} value={b}>
                  {b}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Lọc theo bộ nhớ"
              value={memory || undefined}
              onChange={handleMemoryFilter}
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="64GB">64GB</Option>
              <Option value="128GB">128GB</Option>
              <Option value="256GB">256GB</Option>
              <Option value="512GB">512GB</Option>
              <Option value="1TB">1TB</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Lọc theo trạng thái"
              value={status || undefined}
              onChange={handleStatusFilter}
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="Còn hàng">Còn hàng</Option>
              <Option value="Hết hàng">Hết hàng</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Table
        dataSource={filteredProducts}
        columns={columns}
        rowKey="_id"
        loading={{
          spinning: loading,
          indicator: <Spin size="large" />,
        }}
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default ProductsList;