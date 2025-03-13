import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../../../service/api";
import { Card, Spin, message } from "antd";

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
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];

      // Lọc chỉ lấy các sản phẩm có chữ "iPhone"
      const filteredProducts = data.filter(product =>
        product.TenSP.toLowerCase().includes("iphone")
      );

      setProducts(prevProducts => {
        let newProducts = [...prevProducts, ...filteredProducts].slice(-8); // Giữ tối đa 8 sản phẩm
        return newProducts;
      });
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
    <div style={{ width: "100%", textAlign: "center", padding: "20px 0" }}>
      <h2>Sản phẩm iPhone mới nhất</h2>
      {loading ? (
        <Spin />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)", // Mỗi hàng 4 sản phẩm
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
                onClick={() => handleCardClick(product._id)}
              >
                <Link to={`/products/product_detail/${product._id}`} onClick={(e) => e.stopPropagation()}>
                  <img
                    src={product.HinhAnh1}
                    alt={product.TenSP}
                    style={{ height: 150, objectFit: "contain", width: "100%", backgroundColor: "#f8f8f8" }}
                  />
                </Link>
                <Card.Meta
                  title={product.TenSP}
                  description={
                    <>
                      <span style={{ color: "#555", fontSize: "14px" }}>
                        {product.BoNhoTrong1 ? `Bộ nhớ: ${product.BoNhoTrong1}` : "Chưa có thông tin bộ nhớ"}
                      </span>
                      <span style={{ color: "red", fontWeight: "bold", display: "block" }}>
                        {product.GiaSP1 ? product.GiaSP1.toLocaleString() + " VNĐ" : "Chưa có giá"}
                      </span>
                    </>
                  }
                />
              </Card>
            ))
          ) : (
            <p>Không có sản phẩm iPhone nào.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LatestProducts;