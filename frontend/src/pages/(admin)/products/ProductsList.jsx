import React, { useEffect, useState } from "react";
import { fetchProducts, deleteProducts } from "../../../service/api";
import { message, Table, Button, Popconfirm, Input, Select } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";

const { Option } = Select;

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

      // Tạo danh sách thương hiệu dựa vào chữ đầu tiên của TenSP
      const uniqueBrands = [...new Set(data.map(p => p.TenSP.split(" ")[0]))];
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
    let filtered = products;

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
      filtered = filtered.filter((p) => p.TenSP.startsWith(brand));
    }

    setFilteredProducts(filtered);
  };

  const columns = [
    { title: "Tên sản phẩm", dataIndex: "TenSP", key: "TenSP" },
    { title: "Bộ nhớ", dataIndex: "BoNhoTrong1", key: "BoNhoTrong1" },
    { title: "Trạng thái", dataIndex: "TrangThai", key: "TrangThai" },
    {
      title: "Hình ảnh",
      dataIndex: "HinhAnh1",
      key: "HinhAnh1",
      render: (text) => <img src={text} alt="Hình ảnh sản phẩm" style={{ width: 50, height: 50 }} />,
    },
    {
      title: "Chi tiết",
      key: "action",
      render: (text, record) => (
        <Link to={`/admin/products/${record._id}`}>
          <Button type="primary">Xem chi tiết</Button>
        </Link>
      ),
    },
    {
      title: "Xóa",
      key: "delete",
      render: (text, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
          onConfirm={() => handleDelete(record._id)}
          okText="Có"
          cancelText="Không"
        >
          <Button type="primary" danger>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Input
          placeholder="Nhập tên sản phẩm..."
          style={{ width: 300 }}
          value={search}
          onChange={(e) => handleFilter(e.target.value)}
        />

        <Select
          placeholder="Lọc theo thương hiệu"
          style={{ width: 200 }}
          value={brand || undefined}
          onChange={handleBrandFilter}
          allowClear
        >
          {brands.map((b) => (
            <Option key={b} value={b}>
              {b}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Lọc theo bộ nhớ"
          style={{ width: 200 }}
          value={memory || undefined}
          onChange={handleMemoryFilter}
          allowClear
        >
          <Option value="64GB">64GB</Option>
          <Option value="128GB">128GB</Option>
          <Option value="256GB">256GB</Option>
          <Option value="512GB">512GB</Option>
          <Option value="1TB">1TB</Option>
        </Select>

        <Select
          placeholder="Lọc theo trạng thái"
          style={{ width: 200 }}
          value={status || undefined}
          onChange={handleStatusFilter}
          allowClear
        >
          <Option value="Còn hàng">Còn hàng</Option>
          <Option value="Hết hàng">Hết hàng</Option>
        </Select>
      </div>

      <Link to="/admin/products/add">
        <Button type="primary" style={{ marginBottom: 20 }}>
          Thêm sản phẩm
        </Button>
      </Link>

      <Table
        dataSource={filteredProducts}
        columns={columns}
        rowKey="_id"
        loading={loading}
        bordered
      />
    </div>
  );
};

export default ProductsList;
