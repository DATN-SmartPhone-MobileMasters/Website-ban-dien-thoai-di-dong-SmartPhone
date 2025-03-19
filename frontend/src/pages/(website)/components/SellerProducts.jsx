import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../../../service/api";
import { Spin, message } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getSellerProducts();
  }, []);

  const getSellerProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts();
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      // Lọc bỏ sản phẩm có tên chứa "iphone"
      const filteredProducts = data.filter(
        (product) => !product.TenSP.toLowerCase().includes("iphone")
      );

      // Giữ lại tối đa 8 sản phẩm mới nhất
      setProducts(filteredProducts.slice(-8));
    } catch (error) {
      message.error("Lỗi khi lấy danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/products/product_detail/${id}`);
  };

  return (
    <div className="w-full text-center py-12 bg-gradient-to-b from-gray-100 to-gray-200">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-8">
        💎 Các sản phẩm khác 💎
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={10}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          navigation={true}
          pagination={{ clickable: true }}
          className="w-full max-w-7xl mx-auto"
        >
          {products.length > 0 ? (
            products.map((product) => (
              <SwiperSlide key={product._id}>
                <div
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 p-5 cursor-pointer border border-gray-200 hover:border-gray-400"
                  onClick={() => handleCardClick(product._id)}
                >
                  <img
                    src={product.HinhAnh1}
                    alt={product.TenSP}
                    title={product.TenSP}
                    className="h-48 w-full object-cover bg-gray-100 rounded-lg"
                  />
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
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
              </SwiperSlide>
            ))
          ) : (
            <p className="text-gray-600 text-lg">Không có sản phẩm nào.</p>
          )}
        </Swiper>
      )}
    </div>
  );
};

export default SellerProducts;
