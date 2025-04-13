import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../../../service/api";
import { Spin, message, Card, Typography, Empty } from "antd";
import { FireOutlined } from "@ant-design/icons";
import Socket from "../socket/Socket";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const { Title, Text } = Typography;
const { Meta } = Card;

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getLatestProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts();
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      const filteredProducts = data.filter(
        (product) =>
          product.TenSP.toLowerCase().includes("iphone") &&
          !(
            product.SoLuong1 === 0 &&
            product.SoLuong2 === 0 &&
            product.SoLuong3 === 0 &&
            product.SoLuong4 === 0 &&
            product.SoLuong5 === 0 &&
            product.SoLuong6 === 0
          )
      );

      const sortedProducts = filteredProducts
        .sort((a, b) => b._id.localeCompare(a._id))
        .slice(0, 8);

      setProducts(sortedProducts);
    } catch (error) {
      message.error("Lỗi khi lấy sản phẩm mới nhất!");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLatestProducts();

    // Lắng nghe sự kiện productCreated
    Socket.on("productCreated", (newProduct) => {
      setProducts((prevProducts) => {
        const isIphone = newProduct.TenSP.toLowerCase().includes("iphone");
        const isInStock = !(
          newProduct.SoLuong1 === 0 &&
          newProduct.SoLuong2 === 0 &&
          newProduct.SoLuong3 === 0 &&
          newProduct.SoLuong4 === 0 &&
          newProduct.SoLuong5 === 0 &&
          newProduct.SoLuong6 === 0
        );

        if (isIphone && isInStock) {
          const updatedProducts = [newProduct, ...prevProducts];
          return updatedProducts
            .sort((a, b) => b._id.localeCompare(a._id))
            .slice(0, 8);
        }

        return prevProducts;
      });
    });

    // Lắng nghe sự kiện productUpdated
    Socket.on("productUpdated", (updatedProduct) => {
      setProducts((prevProducts) => {
        let updatedProducts = [...prevProducts];
        const isIphone = updatedProduct.TenSP.toLowerCase().includes("iphone");
        const isInStock = !(
          updatedProduct.SoLuong1 === 0 &&
          updatedProduct.SoLuong2 === 0 &&
          updatedProduct.SoLuong3 === 0 &&
          updatedProduct.SoLuong4 === 0 &&
          updatedProduct.SoLuong5 === 0 &&
          updatedProduct.SoLuong6 === 0
        );
        const productIndex = updatedProducts.findIndex((p) => p._id === updatedProduct._id);

        if (productIndex !== -1) {
          if (isIphone && isInStock) {
            updatedProducts[productIndex] = updatedProduct;
          } else {
            updatedProducts.splice(productIndex, 1);
          }
        } else if (isIphone && isInStock && updatedProducts.length < 8) {
          updatedProducts.unshift(updatedProduct);
        }

        return updatedProducts
          .sort((a, b) => b._id.localeCompare(a._id))
          .slice(0, 8);
      });
    });

    // Dọn dẹp các sự kiện khi component unmount
    return () => {
      Socket.off("productCreated");
      Socket.off("productUpdated");
    };
  }, []);

  const swiperConfig = {
    slidesPerView: Math.min(products.length || 1, 4),
    slidesPerGroup: 1,
    spaceBetween: 20,
    navigation: true,
    pagination: { clickable: true },
    loop: products.length >= 5,
    modules: [Navigation, Pagination],
  };

  return (
    <div className="w-full py-12 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <Title level={2} className="text-center mb-8 text-blue-600">
          <FireOutlined className="text-red-500 mr-2" />
          Sản phẩm iPhone mới nhất
          <FireOutlined className="text-red-500 ml-2" />
        </Title>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" tip="Đang tải sản phẩm..." />
          </div>
        ) : products.length > 0 ? (
          <Swiper {...swiperConfig}>
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <Link to={`/products/product_detail/${product._id}`} className="block h-full">
                  <Card
                    hoverable
                    cover={
                      <div className="h-48 flex items-center justify-center bg-gray-50 p-4">
                        <img
                          alt={product.TenSP}
                          src={product.HinhAnh1}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    }
                    className="h-full border border-gray-200 hover:border-blue-300 transition-all"
                  >
                    <Meta
                      title={
                        <div className="text-center">
                          <Text
                            ellipsis={{ tooltip: product.TenSP }}
                            className="font-semibold text-blue-600"
                          >
                            {product.TenSP}
                          </Text>
                        </div>
                      }
                      description={
                        <div className="text-center">
                          <div className="mb-2">
                            <Text type="secondary" className="text-gray-600">
                              {product.BoNhoTrong1 || "Chưa có thông tin bộ nhớ"}
                            </Text>
                          </div>
                          <Text strong className="text-blue-600 text-lg">
                            {product.GiaSP1
                              ? new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(product.GiaSP1)
                              : "Liên hệ"}
                          </Text>
                        </div>
                      }
                    />
                  </Card>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="col-span-full py-8">
            <Empty
              description={
                <Text type="secondary">Không có sản phẩm iPhone nào hiện có</Text>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestProducts;