import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../../../service/api";
import { Spin, message } from "antd";

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getLatestProducts();
  }, []);

  const getLatestProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts();
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      // Lọc sản phẩm chỉ lấy iPhone và ẩn nếu cả 3 SoLuong đều bằng 0
      const filteredProducts = data.filter((product) =>
        product.TenSP.toLowerCase().includes("iphone") &&
        !(product.SoLuong1 === 0 && product.SoLuong2 === 0 && product.SoLuong3 === 0)
      );

      setProducts(filteredProducts.slice(-8)); // Giữ tối đa 8 sản phẩm
    } catch (error) {
      message.error("Lỗi khi lấy sản phẩm mới nhất!");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="w-full text-center py-12 bg-gradient-to-b from-gray-100 to-gray-200">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8">
        🔥 Sản phẩm iPhone mới nhất 🔥
      </h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 md:px-12 max-w-7xl mx-auto">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 p-5 cursor-pointer border border-gray-200 hover:border-gray-400"
                onClick={() => handleCardClick(product._id)}
              >
                <Link
                  to={`/products/product_detail/${product._id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="h-48 flex justify-center items-center bg-gray-100 rounded-lg">
                    <img
                      src={product.HinhAnh1}
                      alt={product.TenSP}
                      title={product.TenSP}
                      className="h-full w-full object-contain bg-white p-2 rounded-lg"
                    />
                  </div>
                </Link>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 whitespace-normal break-words">
                    {product.TenSP}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {product.BoNhoTrong1
                      ? `Bộ nhớ: ${product.BoNhoTrong1}`
                      : "Chưa có thông tin bộ nhớ"}
                  </p>
                  <p className="text-red-600 font-bold text-lg mt-3 bg-yellow-100 px-2 py-1 rounded-md">
                    {product.GiaSP1
                      ? product.GiaSP1.toLocaleString() + " VNĐ"
                      : "Chưa có giá"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-lg">
              Không có sản phẩm iPhone nào.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LatestProducts;
