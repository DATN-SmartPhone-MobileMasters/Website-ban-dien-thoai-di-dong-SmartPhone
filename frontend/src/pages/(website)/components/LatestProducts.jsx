import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../../../service/api";
import { Spin, message, Card, Typography, Empty } from "antd";
import { FireOutlined } from "@ant-design/icons";
import Socket from "../socket/Socket"; // Import Socket.IO client

const { Title, Text } = Typography;
const { Meta } = Card;

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getLatestProducts();

    // Lắng nghe sự kiện productUpdated từ server
    Socket.on("productUpdated", (updatedProduct) => {
      setProducts((prevProducts) => {
        // Kiểm tra nếu sản phẩm cập nhật nằm trong danh sách hiện tại
        const productIndex = prevProducts.findIndex((p) => p._id === updatedProduct._id);
        let updatedProducts = [...prevProducts];

        // Nếu sản phẩm tồn tại trong danh sách
        if (productIndex !== -1) {
          const currentProduct = updatedProducts[productIndex];
          const isIphone = updatedProduct.TenSP.toLowerCase().includes("iphone");
          const isInStock = !(
            updatedProduct.SoLuong1 === 0 &&
            updatedProduct.SoLuong2 === 0 &&
            updatedProduct.SoLuong3 === 0
          );

          // Nếu vẫn là iPhone và còn hàng, cập nhật sản phẩm
          if (isIphone && isInStock) {
            updatedProducts[productIndex] = updatedProduct;
          } else {
            // Nếu không còn là iPhone hoặc hết hàng, xóa khỏi danh sách
            updatedProducts.splice(productIndex, 1);
          }
        } else {
          // Nếu sản phẩm không có trong danh sách, kiểm tra xem có thêm vào không
          const isIphone = updatedProduct.TenSP.toLowerCase().includes("iphone");
          const isInStock = !(
            updatedProduct.SoLuong1 === 0 &&
            updatedProduct.SoLuong2 === 0 &&
            updatedProduct.SoLuong3 === 0
          );
          if (isIphone && isInStock && updatedProducts.length < 8) {
            updatedProducts.unshift(updatedProduct); // Thêm vào đầu danh sách
            updatedProducts = updatedProducts.slice(0, 8); // Giữ tối đa 8 sản phẩm
          }
        }

        // Sắp xếp lại theo _id giảm dần
        return updatedProducts.sort((a, b) => b._id.localeCompare(a._id));
      });
    });

    // Cleanup listener khi component unmount
    return () => {
      Socket.off("productUpdated");
    };
  }, []);

  const getLatestProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts();
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      // Lọc sản phẩm iPhone và còn hàng
      const filteredProducts = data.filter(
        (product) =>
          product.TenSP.toLowerCase().includes("iphone") &&
          !(product.SoLuong1 === 0 && product.SoLuong2 === 0 && product.SoLuong3 === 0)
      );

      // Sắp xếp theo ID giảm dần
      const sortedProducts = filteredProducts.sort((a, b) => b._id.localeCompare(a._id));
      
      setProducts(sortedProducts.slice(0, 8)); // Lấy 8 sản phẩm mới nhất
    } catch (error) {
      message.error("Lỗi khi lấy sản phẩm mới nhất!");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <Link 
                  to={`/products/product_detail/${product._id}`} 
                  key={product._id}
                  className="block h-full"
                >
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
                          <Text ellipsis={{ tooltip: product.TenSP }} className="font-semibold text-blue-600">
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
                            {product.GiaSP1 ? 
                              new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GiaSP1)
                              : "Liên hệ"
                            }
                          </Text> 
                        </div>
                      }
                    />
                  </Card>
                </Link>
              ))
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
        )}
      </div>
    </div>
  );
};

export default LatestProducts;