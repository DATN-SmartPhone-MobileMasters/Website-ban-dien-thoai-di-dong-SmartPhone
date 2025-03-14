import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../../../service/api";
import { Card, Spin, message } from "antd";

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
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];

      // Lọc bỏ sản phẩm có tên chứa "iphone"
      const filteredProducts = data.filter(product => !product.TenSP.toLowerCase().includes("iphone"));

      // Giữ lại tối đa 8 sản phẩm mới nhất
      const latestProducts = filteredProducts.slice(-8);

      setProducts(latestProducts);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ width: "100%", textAlign: "center", padding: "20px 0" }}>
      <h2>Các sản phẩm khác</h2>
      {loading ? (
        <Spin />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            justifyContent: "center",
            maxWidth: "900px",
            margin: "0 auto"
          }}
        >
          {products.length > 0 ? (
            products.map((product) => (
              <Card
                key={product._id}
                hoverable
                style={{ width: 220, textAlign: "center", cursor: "pointer" }}
                cover={
                  <img
                    src={product.HinhAnh1}
                    alt={product.TenSP}
                    style={{
                      height: 150,
                      objectFit: "contain",
                      width: "100%",
                      backgroundColor: "#f8f8f8",
                    }}
                    onClick={() => navigate(`/products/product_detail/${product._id}`)}
                  />
                }
              >
                <Card.Meta
                  title={product.TenSP}
                  description={<span style={{ color: "red", fontWeight: "bold" }}>{product.GiaSP1.toLocaleString()} VNĐ</span>}
                />
              </Card>
            ))
          ) : (
            <p>Không có sản phẩm nào phù hợp.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
