import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProducts } from "../../../service/api";

const ProductsDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState({
    memory: "",
    price: 0,
    quantity: 0,
  });

  // Trong ProductsDetail.js
useEffect(() => {
  setLoading(true);

  getProducts(id)
    .then((response) => {
      const productData = response.data.data;
      setProduct(productData);

      if (productData.BoNhoTrong1) {
        setSelectedMemory({
          memory: productData.BoNhoTrong1,
          price: productData.GiaSP1,
          quantity: productData.SoLuong1,
        });
      }

      setLoading(false);
    })
    .catch(() => {
      setError("Không thể tải chi tiết sản phẩm.");
      setLoading(false);
    });
}, [id]);

  const handleMemorySelection = (memoryKey) => {
    const memory = product[memoryKey];
    const memoryIndex = memoryKey.slice(-1); 

    setSelectedMemory({
      memory: memory,
      price: product[`GiaSP${memoryIndex}`],
      quantity: product[`SoLuong${memoryIndex}`],
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-2">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  if (!product) {
    return <div className="alert alert-warning text-center">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Chi Tiết Sản Phẩm</h1>
        <div>
          <Link to="/admin/products">
            <button className="btn btn-secondary me-2">Quay lại</button>
          </Link>
          <Link to={`/admin/products/edit/${id}`}>
            <button className="btn btn-warning">Chỉnh sửa</button>
          </Link>
        </div>
      </div>

      {/* Thông Tin Cơ Bản */}
      <div className="card shadow mb-4">
        <div className="card-header py-3 bg-primary text-white">
          <h6 className="m-0 font-weight-bold">Thông Tin Cơ Bản</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Mã Sản Phẩm:</strong> {product.MaSP}</p>
              <p><strong>Tên Sản Phẩm:</strong> {product.TenSP}</p>
              <p><strong>Tên Thương Hiệu:</strong> {product.TenTH}</p>
              <p><strong>Màn Hình:</strong> {product.ManHinh}</p>
              <p><strong>Pin:</strong> {product.LoaiPin}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Hệ Điều Hành:</strong> {product.HDH}</p>
              <p><strong>Camera Sau:</strong> {product.CamSau}</p>
              <p><strong>Camera Trước:</strong> {product.CamTruoc}</p>
              <p><strong>CPU:</strong> {product.CPU}</p>
              <p><strong>Trạng Thái:</strong> {product.TrangThai}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phiên Bản Sản Phẩm */}
      <div className="card shadow mb-4">
        <div className="card-header py-3 bg-info text-white">
          <h6 className="m-0 font-weight-bold">Phiên Bản Sản Phẩm</h6>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Bộ Nhớ Trong */}
            <div className="col-md-6">
              <p><strong>Bộ Nhớ Trong:</strong></p>
              <div className="d-flex gap-2 mb-3">
                {["BoNhoTrong1", "BoNhoTrong2", "BoNhoTrong3"].map((key, index) => {
                  if (!product[key]) return null;

                  return (
                    <button
                      key={index}
                      className={`btn ${
                        selectedMemory.memory === product[key] ? "btn-primary" : "btn-outline-primary"
                      }`}
                      onClick={() => handleMemorySelection(key)}
                      style={{ height: "38px" }} 
                    >
                      {product[key]}
                    </button>
                  );
                })}
              </div>

              <p><strong>Số Lượng:</strong> {selectedMemory.quantity}</p>
              <p>
                <strong>Giá:</strong>
                <span className="text-danger ms-2">{formatCurrency(selectedMemory.price)}</span>
              </p>
            </div>

            {/* Màu Sắc */}
            <div className="col-md-6">
              <p><strong>Màu Sắc:</strong></p>
              <div className="d-flex flex-column gap-2">
                {[product.Mau1, product.Mau2, product.Mau3].map((color, index) =>
                  color && (
                    <div key={index} className="d-flex align-items-center gap-2" style={{ height: "38px" }}>
                      <div
                        className="color-box shadow-sm"
                        style={{
                          width: "30px",
                          height: "30px",
                          backgroundColor: color,
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          cursor: "pointer",
                          transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.1)";
                          e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                          e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                        }}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hình Ảnh Sản Phẩm */}
      <div className="card shadow mb-4">
        <div className="card-header py-3 bg-success text-white">
          <h6 className="m-0 font-weight-bold">Hình Ảnh Sản Phẩm</h6>
        </div>
        <div className="card-body">
          <div className="d-flex gap-3">
            {[1, 2, 3].map(
              (index) =>
                product[`HinhAnh${index}`] && (
                  <img
                    key={index}
                    src={product[`HinhAnh${index}`]}
                    alt={product.TenSP}
                    className="img-fluid rounded shadow-sm"
                    style={{
                      maxWidth: "150px",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.05)";
                      e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                    }}
                  />
                )
            )}
          </div>
        </div>
      </div>

      {/* Mô Tả Sản Phẩm */}
      <div className="card shadow mb-4">
        <div className="card-header py-3 bg-warning text-white">
          <h6 className="m-0 font-weight-bold">Mô Tả Sản Phẩm</h6>
        </div>
        <div className="card-body">
          <p>{product.MoTa}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetail;