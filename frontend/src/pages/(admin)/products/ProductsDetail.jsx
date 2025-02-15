import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/sanphams/${id}`)
      .then((response) => {
        setProduct(response.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải chi tiết sản phẩm.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Chi Tiết Sản Phẩm</h1>
        <Link to="/products">
          <button className="btn btn-secondary">Quay lại</button>
        </Link>
      </div>
    
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Thông Tin Sản Phẩm</h6>
        </div>
        <div className="card-body">
          <div className="mb-3"><strong>Mã Sản Phẩm:</strong> {product.MaSP}</div>
          <div className="mb-3"><strong>Mã Thương Hiệu:</strong> {product.MaTH}</div>
          <div className="mb-3"><strong>Mã Danh Mục:</strong> {product.MaDM}</div>
          <div className="mb-3"><strong>Mã Khuyến Mãi:</strong> {product.MaKM}</div>
          <div className="mb-3"><strong>Tên Sản Phẩm:</strong> {product.TenSP}</div>
          <div className="mb-3">
           </div>
          <div className="mb-3"><strong>Số Lượng:</strong> {product.SoLuong1}</div>
          <div className="mb-3"><strong>Hình Ảnh 1:</strong> <img src={product.HinhAnh1} alt={product.TenSP} className="img-fluid" width={100} /></div>
          <ul>
                <li>Giá 1: <span className="text-danger">{formatCurrency(product.GiaSP1)}</span></li>
              
          </ul> 
          <hr />


          <div className="mb-3"><strong>Số Lượng:</strong> {product.SoLuong2}</div>
          <div className="mb-3"><strong>Hình Ảnh 2:</strong> <img src={product.HinhAnh2} alt={product.TenSP} className="img-fluid" width={100} /></div>
          <ul>
                <li>Giá : <span className="text-danger">{formatCurrency(product.GiaSP2)}</span></li>
              
          </ul>
          <hr />


          <div className="mb-3"><strong>Số Lượng:</strong> {product.SoLuong3}</div>
          <div className="mb-3"><strong>Hình Ảnh 3:</strong> <img src={product.HinhAnh3} alt={product.TenSP} className="img-fluid" width={100} /></div>
          <ul>
                <li>Giá : <span className="text-danger">{formatCurrency(product.GiaSP3)}</span></li>
              
          </ul>
          <hr />

          
          <div className="mb-3"><strong>Bộ Nhớ Trong:</strong> {product.BoNhoTrong}</div>
          <div className="mb-3"><strong>Màu Sắc:</strong> {product.Mau}</div>
          <div className="mb-3"><strong>Màn Hình:</strong> {product.ManHinh}</div>
          <div className="mb-3"><strong>Hệ Điều Hành:</strong> {product.HDH}</div>
          <div className="mb-3"><strong>Camera Sau:</strong> {product.CamSau}</div>
          <div className="mb-3"><strong>Camera Trước:</strong> {product.CamTruoc}</div>
          <div className="mb-3"><strong>Chipset:</strong> {product.Chipset}</div>
          <div className="mb-3"><strong>CPU:</strong> {product.CPU}</div>
          <div className="mb-3"><strong>Trạng Thái:</strong> {product.TrangThai}</div>
          <div className="mb-3"><strong>Pin:</strong> {product.Pin}</div>
          <div className="mb-3"><strong>Thời gian thêm:</strong> {product.created_at}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
