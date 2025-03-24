import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../../service/api";
import { Spin, message, Pagination } from "antd";

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
          <select className="p-3 border rounded-lg text-gray-700 focus:ring focus:ring-blue-300" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
            <option value="">Tất cả thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          <input type="text" className="p-3 border rounded-lg text-gray-700 focus:ring focus:ring-blue-300" placeholder="🔍 Tìm kiếm sản phẩm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

          <select className="p-3 border rounded-lg text-gray-700 focus:ring focus:ring-blue-300" value={selectedStorage} onChange={(e) => setSelectedStorage(e.target.value)}>
            <option value="">Bộ nhớ</option>
            <option value="64GB">64GB</option>
            <option value="128GB">128GB</option>
            <option value="256GB">256GB</option>
            <option value="512GB">512GB</option>
            <option value="1TB">1TB</option>
          </select>

          <select className="p-3 border rounded-lg text-gray-700 focus:ring focus:ring-blue-300" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 p-5 border border-gray-200 hover:border-gray-400 cursor-pointer">
                  <Link to={`/products/product_detail/${product._id}`} onClick={(e) => e.stopPropagation()}>
                    <div className="h-56 flex justify-center items-center bg-gray-100 rounded-lg">
                      <img src={product.HinhAnh1} alt={product.TenSP} title={product.TenSP} className="h-full w-full object-contain bg-white p-2 rounded-lg" />
                    </div>
                  </Link>
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-800 break-words">{product.TenSP}</h3>
                    <p className="text-sm text-gray-600 mt-1">{product.BoNhoTrong1 ? `Bộ nhớ: ${product.BoNhoTrong1}` : "Chưa có thông tin bộ nhớ"}</p>
                    <p className={`font-bold text-lg mt-3 px-2 py-1 rounded-md ${product.SoLuong1 === 0 && product.SoLuong2 === 0 && product.SoLuong3 === 0 ? "text-gray-500 bg-gray-300" : "text-blue-600 bg-blue-200"}`}>
                      {product.SoLuong1 === 0 && product.SoLuong2 === 0 && product.SoLuong3 === 0 ? "Sản phẩm tạm thời hết hàng" : (product.GiaSP1 ? product.GiaSP1.toLocaleString() + " VNĐ" : "Chưa có giá")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Pagination current={currentPage} pageSize={pageSize} total={sortedProducts.length} onChange={handlePageChange} showSizeChanger={false} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
