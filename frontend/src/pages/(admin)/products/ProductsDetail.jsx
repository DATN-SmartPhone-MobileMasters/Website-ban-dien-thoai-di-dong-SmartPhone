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

  useEffect(() => {
    setLoading(true);

    getProducts(id)
      .then((response) => {
        const productData = response.data.data;
        setProduct(productData);

        // Chọn bộ nhớ đầu tiên mặc định nếu có dữ liệu
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
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!product) {
    return <div className="alert alert-warning">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div className="container">
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

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Thông Tin Sản Phẩm</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Mã Sản Phẩm:</strong> {product.MaSP}</p>
              <p><strong>Tên Sản Phẩm:</strong> {product.TenSP}</p>
              <p><strong>Tên Thương Hiệu:</strong> {product.TenTH}</p>

              <p className="mt-3"><strong>Màn Hình:</strong> {product.ManHinh}</p>
              <p><strong>Thời gian thêm:</strong> {product.created_at}</p>
              <p><strong>Pin:</strong> {product.LoaiPin}</p>
              <p><strong>Màu sắc:</strong></p>
              <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                {[product.Mau1, product.Mau2, product.Mau3].map(
                  (color, index) =>
                    color && ( // Chỉ hiển thị nếu có màu
                      <div
                        key={index}
                        style={{
                          width: "30px",
                          height: "30px",
                          backgroundColor: color,
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          transition: "transform 0.3s ease-in-out", // Hiệu ứng mượt
                        }}
                        onMouseEnter={(e) => (e.target.style.transform = "scale(1.2)")} // Phóng to
                        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")} // Thu nhỏ lại
                      />
                    )
                )}
              </div>

            </div>

            <div className="col-md-6">
              <p><strong>Hệ Điều Hành:</strong> {product.HDH}</p>
              <p><strong>Camera Sau:</strong> {product.CamSau}</p>
              <p><strong>Camera Trước:</strong> {product.CamTruoc}</p>
              <p><strong>CPU:</strong> {product.CPU}</p>
              <p><strong>Cáp sạc:</strong> {product.CapSac}</p>
              <p><strong>Trạng Thái:</strong> {product.TrangThai}</p>
            </div>
          </div>

          <hr />

          <h5 className="text-primary">Phiên bản sản phẩm</h5>
          <p><strong>Bộ Nhớ Trong:</strong></p>
          <div className="d-flex gap-2">
            {["BoNhoTrong1", "BoNhoTrong2", "BoNhoTrong3"].map((key, index) => {
              if (!product[key]) return null; // Bỏ qua nếu bộ nhớ không tồn tại

              return (
                <button
                  key={index}
                  className={`btn ${selectedMemory.memory === product[key] ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setSelectedMemory({
                    memory: product[key],
                    price: product[`GiaSP${index + 1}`],
                    quantity: product[`SoLuong${index + 1}`],
                  })}
                >
                  {product[key]}
                </button>
              );
            })}
          </div>

          <div className="row align-items-center mt-3">
            <div className="col-md-6">
              <p><strong>Số Lượng:</strong> {selectedMemory.quantity}</p>
              <p>
                <strong>Giá:</strong>
                <span className="text-danger ms-2">
                  {formatCurrency(selectedMemory.price)}
                </span>
              </p>
            </div>

            <div className="col-md-6">
              <div className="d-flex">
                {[1, 2, 3].map((index) =>
                  product[`HinhAnh${index}`] ? (
                    <img
                      key={index}
                      src={product[`HinhAnh${index}`]}
                      alt={product.TenSP}
                      className="img-thumbnail rounded shadow-sm mx-2"
                      width={100}
                      style={{
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  ) : null
                )}
              </div>
            </div>

          </div>
          <p><strong>Mô tả:</strong> {product.MoTa}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetail;
