import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [product, setProduct] = useState(null); // Dữ liệu sản phẩm
  const [error, setError] = useState(""); // Lỗi nếu có
  const [loading, setLoading] = useState(false); // Trạng thái loading

  useEffect(() => {
    setLoading(true); // Bắt đầu loading
    axios
      .get(`http://localhost:5000/api/sanphams/${id}`)
      .then((response) => {
        setProduct(response.data.data); // Cập nhật dữ liệu sản phẩm vào state
        setLoading(false); // Kết thúc loading
      })
      .catch((err) => {
        setError("Không thể tải chi tiết sản phẩm.");
        setLoading(false); // Kết thúc loading
      });
  }, [id]);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!product) {
    return <div>Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div className="container-fluid">
      {/* Page Heading */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Chi Tiết Sản Phẩm</h1>
        <Link to="/products">
          <button className="btn btn-secondary">
            <i></i> Quay lại
          </button>
        </Link>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Thông Tin Sản Phẩm</h6>
        </div>
        <div className="card-body">
          {/* Hiển thị chi tiết sản phẩm */}
          <div className="mb-3">
            <strong>Mã Thương hiệu:</strong> {product.MaTH}
          </div>
          <div className="mb-3">
            <strong>Mã Danh Mục:</strong> {product.MaDM}
          </div>
          <div className="mb-3">
            <strong>Mã Khuyến Mãi:</strong> {product.MaKM}
          </div>
          <div className="mb-3">
            <strong>Tên Sản Phẩm:</strong> {product.TenSP}
          </div>
          <div className="mb-3">
            <strong>Giá Sản Phẩm:</strong> {product.GiaSP}
          </div>
          <div className="mb-3">
            <strong>Số Lượng:</strong> {product.SoLuong}
          </div>
          <div className="mb-3">
            <strong>Hình Ảnh:</strong> <img src={product.HinhAnh1} alt={product.TenSP} className="img-fluid" />
          </div>
          <div className="mb-3">
            <strong>Bộ Nhớ Trong:</strong> {product.BoNhoTrong}
          </div>
          <div className="mb-3">
            <strong>Màu Sắc:</strong> {product.Mau}
          </div>
          <div className="mb-3">
            <strong>Màn Hình:</strong> {product.ManHinh}
          </div>
          <div className="mb-3">
            <strong>Mô Tả:</strong> {product.MoTa}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
