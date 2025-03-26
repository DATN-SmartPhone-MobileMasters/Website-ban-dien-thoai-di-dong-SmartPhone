import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../../service/api";
import { Spin, message, Pagination, Select, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand, selectedStorage, searchQuery, sortOrder]);

  const normalizeBrandName = (name) => {
    // Chuẩn hóa tên thương hiệu
    // Ví dụ: "Iphone13" -> "Iphone 13", "Iphone 13" -> "Iphone 13"
    const match = name.match(/^(Iphone|Samsung|Xiaomi|Oppo)(\d+)/i);
    if (match) {
      const brand = match[1]; // "Iphone", "Samsung", v.v.
      const model = match[2]; // "13", "14", v.v.
      return `${brand} ${model}`; // Trả về "Iphone 13"
    }
    // Nếu không khớp với định dạng "Iphone13", lấy từ đầu tiên
    return name.split(" ")[0];
  };

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts();
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setProducts(data);

      // Lấy danh sách thương hiệu và chuẩn hóa
      const uniqueBrands = [...new Set(data.map((product) => {
        const nameParts = product.TenSP.split("|")[0].trim(); // Lấy phần trước dấu "|"
        return normalizeBrandName(nameParts); // Chuẩn hóa tên thương hiệu
      }))];
      setBrands(uniqueBrands);
    } catch (error) {
      message.error("Lỗi khi tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = [...products]
    .filter((product) => selectedStorage ? product.BoNhoTrong1 === selectedStorage : true)
    .filter((product) => {
      if (!selectedBrand) return true;
      const normalizedProductName = normalizeBrandName(product.TenSP.split("|")[0].trim());
      return normalizedProductName.toLowerCase().startsWith(selectedBrand.toLowerCase());
    })
    .filter((product) => searchQuery ? product.TenSP.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    .sort((a, b) => {
      const priceA = Number(a.GiaSP1) || 0;
      const priceB = Number(b.GiaSP1) || 0;
      if (sortOrder === "asc") return priceA - priceB;
      if (sortOrder === "desc") return priceB - priceA;
      return 0;
    });

  const indexOfLastProduct = currentPage * pageSize;
  const indexOfFirstProduct = indexOfLastProduct - pageSize;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">📢 Danh sách sản phẩm</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-white p-4 shadow-md rounded-lg">
          <Select
            placeholder="Tất cả thương hiệu"
            value={selectedBrand || undefined}
            onChange={(value) => setSelectedBrand(value)}
            allowClear
            className="w-full"
          >
            {brands.map((brand) => (
              <Option key={brand} value={brand}>{brand}</Option>
            ))}
          </Select>

          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
          />

          <Select
            placeholder="Bộ nhớ"
            value={selectedStorage || undefined}
            onChange={(value) => setSelectedStorage(value)}
            allowClear
            className="w-full"
          >
            <Option value="64GB">64GB</Option>
            <Option value="128GB">128GB</Option>
            <Option value="256GB">256GB</Option>
            <Option value="512GB">512GB</Option>
            <Option value="1TB">1TB</Option>
          </Select>

          <Select
            placeholder="Sắp xếp theo"
            value={sortOrder || undefined}
            onChange={(value) => setSortOrder(value)}
            allowClear
            className="w-full"
          >
            <Option value="asc">Giá thấp đến cao</Option>
            <Option value="desc">Giá cao đến thấp</Option>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <Link 
                  to={`/products/product_detail/${product._id}`} 
                  key={product._id}
                  className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 p-5 border border-gray-200 hover:border-gray-400"
                >
                  <div className="h-56 flex justify-center items-center bg-gray-100 rounded-lg">
                    <img 
                      src={product.HinhAnh1} 
                      alt={product.TenSP} 
                      className="h-full w-full object-contain bg-white p-2 rounded-lg" 
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-800 break-words">{product.TenSP}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {product.BoNhoTrong1 ? `Bộ nhớ: ${product.BoNhoTrong1}` : "Chưa có thông tin bộ nhớ"}
                    </p>
                    <p className={`font-bold text-lg mt-3 px-2 py-1 rounded-md ${
                      product.SoLuong1 === 0 && product.SoLuong2 === 0 && product.SoLuong3 === 0 
                        ? "text-gray-500 bg-gray-300" 
                        : "text-blue-600 bg-blue-200"
                    }`}>
                      {product.SoLuong1 === 0 && product.SoLuong2 === 0 && product.SoLuong3 === 0 
                        ? "Sản phẩm tạm thời hết hàng" 
                        : (product.GiaSP1 ? `${product.GiaSP1.toLocaleString()} VNĐ` : "Chưa có giá")
                      }
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Pagination 
                current={currentPage} 
                pageSize={pageSize} 
                total={sortedProducts.length} 
                onChange={handlePageChange} 
                showSizeChanger={false} 
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;