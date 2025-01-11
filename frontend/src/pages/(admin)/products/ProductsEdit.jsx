import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductsEdit = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate(); // Dùng để điều hướng trang sau khi cập nhật thành công

  const [formData, setFormData] = useState({
    MaSP: "",
    MaTH: "",
    MaDM: "",
    MaKM: "",
    TenSP: "",
    GiaSP: "",
    SoLuong: "",
    HinhAnh1: "",
    BoNhoTrong: "",
    Mau: "",
    ManHinh: "",
    MoTa: "",
  });

  const [error, setError] = useState(""); // Dùng để hiển thị lỗi tổng quan
  const [loading, setLoading] = useState(false); // Dùng để hiển thị trạng thái loading
  const [formErrors, setFormErrors] = useState({}); // Để lưu lỗi cho từng trường

  // Lấy dữ liệu sản phẩm khi component được render
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/sanphams/${id}`)
      .then((response) => {
        setFormData(response.data.data); // Gán dữ liệu lấy được vào formData
        setLoading(false);
      })
      .catch((err) => {
        setError("Không thể tải dữ liệu sản phẩm.");
        setLoading(false);
      });
  }, [id]);

  // Hàm xử lý thay đổi giá trị input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" }); // Xóa lỗi khi người dùng sửa giá trị
  };

  // Hàm kiểm tra và xác thực các trường dữ liệu
  const validate = () => {
    const errors = {};
    const {
      MaSP,
      MaTH,
      MaDM,
      MaKM,
      TenSP,
      GiaSP,
      SoLuong,
      HinhAnh1,
      BoNhoTrong,
      Mau,
      ManHinh,
      MoTa,
    } = formData;

    if (!MaSP) errors.MaSP = "Mã sản phẩm là bắt buộc.";
    if (!MaTH) errors.MaTH = "Mã thể loại là bắt buộc.";
    if (!MaDM) errors.MaDM = "Mã danh mục là bắt buộc.";
    if (!MaKM) errors.MaKM = "Mã khuyến mãi là bắt buộc.";
    if (!TenSP) errors.TenSP = "Tên sản phẩm là bắt buộc.";
    if (!GiaSP) errors.GiaSP = "Giá sản phẩm là bắt buộc.";
    if (!SoLuong) errors.SoLuong = "Số lượng là bắt buộc.";
    if (!HinhAnh1) errors.HinhAnh1 = "Hình ảnh là bắt buộc.";
    if (!BoNhoTrong) errors.BoNhoTrong = "Bộ nhớ trong là bắt buộc.";
    if (!Mau) errors.Mau = "Màu sắc là bắt buộc.";
    if (!ManHinh) errors.ManHinh = "Màn hình là bắt buộc.";
    if (!MoTa) errors.MoTa = "Mô tả là bắt buộc.";

    return errors;
  };


  const handleSubmit = (e) => {
    e.preventDefault();

  
    const errors = validate();
    setFormErrors(errors);

   
    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);
    setError(""); 

  
    axios
      .put(`http://localhost:5000/api/sanphams/${id}`, formData)
      .then((response) => {
        alert("Cập nhật sản phẩm thành công!");
        navigate("/ProductsList"); 
      })
      .catch((err) => {
        setError("Có lỗi xảy ra khi cập nhật sản phẩm.");
        setLoading(false);
      });
  };

  return (
    <div className="container-fluid">
   
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Cập Nhật Sản Phẩm</h1>
        <button className="btn btn-secondary" onClick={() => navigate("/ProductsList")}>
          Quay Lại
        </button>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Cập Nhật Thông Tin Sản Phẩm</h6>
        </div>
        <div className="card-body">
        
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

        
          <form onSubmit={handleSubmit}>
          
            {[
              { label: "Mã Thể Loại", name: "MaTH" },
              { label: "Mã Danh Mục", name: "MaDM" },
              { label: "Mã Khuyến Mãi", name: "MaKM" },
              { label: "Tên Sản Phẩm", name: "TenSP" },
              { label: "Giá Sản Phẩm", name: "GiaSP", type: "number" },
              { label: "Số Lượng", name: "SoLuong", type: "number" },
              { label: "Hình Ảnh", name: "HinhAnh1" },
              { label: "Bộ Nhớ Trong", name: "BoNhoTrong" },
              { label: "Màu Sắc", name: "Mau" },
              { label: "Màn Hình", name: "ManHinh" },
            ].map((field, index) => (
              <div className="mb-3" key={index}>
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                </label>
                <input
                  type={field.type || "text"}
                  className="form-control"
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
                {formErrors[field.name] && (
                  <div className="text-danger">{formErrors[field.name]}</div>
                )}
              </div>
            ))}
            <div className="mb-3">
              <label htmlFor="MoTa" className="form-label">Mô Tả</label>
              <textarea
                className="form-control"
                id="MoTa"
                name="MoTa"
                value={formData.MoTa}
                onChange={handleChange}
              ></textarea>
              {formErrors.MoTa && (
                <div className="text-danger">{formErrors.MoTa}</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang Lưu...
                </>
              ) : (
                "Cập Nhật Sản Phẩm"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductsEdit;
