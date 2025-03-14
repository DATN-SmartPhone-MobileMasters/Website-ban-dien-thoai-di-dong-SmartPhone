import React, { useEffect, useState } from "react";
import { message } from "antd";
import { fetchOrders } from "../../../service/api";

const TopProducts = () => {
  const [hoaDons, setHoaDons] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const getHoaDons = async () => {
      try {
        const response = await fetchOrders();
        setHoaDons(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách hóa đơn:", error);
        message.error("Lỗi khi tải danh sách hóa đơn!");
      }
    };
    getHoaDons();
  }, []);

  useEffect(() => {
    const calculateTopProducts = () => {
      const productMap = {};

      hoaDons.forEach((hoaDon) => {
        hoaDon.products.forEach((product) => {
          if (productMap[product.name]) {
            productMap[product.name].quantity += product.quantity;
          } else {
            productMap[product.name] = {
              name: product.name,
              image: product.image,
              quantity: product.quantity,
            };
          }
        });
      });

      const sortedProducts = Object.values(productMap).sort(
        (a, b) => b.quantity - a.quantity
      );

      setTopProducts(sortedProducts);
    };

    calculateTopProducts();
  }, [hoaDons]);

  return (
    <div className="col-xl-12 col-lg-12 mb-4">
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">
            Sản phẩm được mua nhiều nhất
          </h6>
        </div>
        <div className="card-body d-flex flex-wrap justify-content-start gap-3">
          {topProducts.length > 0 ? (
            <div
              className="d-flex flex-wrap justify-content-start gap-4"
              style={{ width: "100%" }}
            >
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center gap-3"
                  style={{ width: "250px" }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <p className="font-weight-bold" style={{ margin: 0 }}>
                    {product.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">Không có dữ liệu sản phẩm.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
