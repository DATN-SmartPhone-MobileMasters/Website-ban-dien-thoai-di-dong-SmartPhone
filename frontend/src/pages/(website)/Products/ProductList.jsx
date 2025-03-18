import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../../service/api";
import { Spin, message } from "antd";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts();
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setProducts(data);

      const uniqueBrands = [...new Set(data.map((product) => product.TenSP.split(" ")[0]))];
      setBrands(uniqueBrands);
    } catch (error) {
      message.error("Lỗi khi tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = [...products]
    .filter((product) => selectedStorage ? product.BoNhoTrong1 === selectedStorage : true)
    .filter((product) => selectedBrand ? product.TenSP.toLowerCase().includes(selectedBrand.toLowerCase()) : true)
    .filter((product) => searchQuery ? product.TenSP.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    .sort((a, b) => {
      const priceA = Number(a.GiaSP1) || 0;
      const priceB = Number(b.GiaSP1) || 0;
      if (sortOrder === "asc") return priceA - priceB;
      if (sortOrder === "desc") return priceB - priceA;
      return 0;
    });

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">📢 Danh sách sản phẩm</h2>

        {/* Bộ lọc */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 bg-white p-4 shadow-md rounded-lg">
          <select
            className="p-3 border rounded-lg text-gray-700 focus:ring focus:ring-blue-300"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          <input
            type="text"
            className="p-3 border rounded-lg text-gray-700 focus:ring focus:ring-blue-300"
            placeholder="🔍 Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="p-3 border rounded-lg text-gray-700 focus:ring focus:ring-blue-300"
            value={selectedStorage}
            onChange={(e) => setSelectedStorage(e.target.value)}
          >
            <option value="">Bộ nhớ</option>
            <option value="64GB">64GB</option>
            <option value="128GB">128GB</option>
            <option value="256GB">256GB</option>
            <option value="512GB">512GB</option>
            <option value="1TB">1TB</option>
          </select>

          <select
            className="p-3 border rounded-lg text-gray-700 focus:ring focus:ring-blue-300"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Sắp xếp theo</option>
            <option value="asc">⬆ Giá thấp đến cao</option>
            <option value="desc">⬇ Giá cao đến thấp</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 p-5 border border-gray-200 hover:border-gray-400 cursor-pointer"
              >
                <Link to={`/products/product_detail/${product._id}`} onClick={(e) => e.stopPropagation()}>
                  <div className="relative">
                    <img
                      src={product.HinhAnh1}
                      alt={product.TenSP}
                      title={product.TenSP}
                      className="h-48 w-full object-cover bg-gray-100 rounded-lg"
                    />
                    {/* Hiển thị tên sản phẩm khi hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
                      <span className="text-white text-lg font-semibold text-center px-2">{product.TenSP}</span>
                    </div>
                  </div>
                </Link>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{product.TenSP}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {product.BoNhoTrong1 ? `Bộ nhớ: ${product.BoNhoTrong1}` : "Chưa có thông tin bộ nhớ"}
                  </p>
                  <p className="text-red-600 font-bold text-lg mt-3 bg-yellow-100 px-2 py-1 rounded-md">
                    {product.GiaSP1 ? product.GiaSP1.toLocaleString() + " VNĐ" : "Chưa có giá"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
