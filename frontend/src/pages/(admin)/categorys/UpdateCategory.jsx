import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateCategory = () => {
  const [formData, setFormData] = useState({
    MaDM: "",
    TenDM: "",
  });
  const [error, setError] = useState(null); // Để hiển thị lỗi
  const [loading, setLoading] = useState(false); // Để hiển thị trạng thái loading
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy id từ URL

  // Hàm xử lý khi form thay đổi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Lấy dữ liệu của danh mục cần sửa
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/danhmucs/${id}`)
      .then((response) => {
        setFormData({
          MaDM: response.data.data.MaDM,
          TenDM: response.data.data.TenDM,
        });
      })
      .catch((error) => {
        setError("Không thể tải dữ liệu danh mục.");
        console.error(error);
      });
  }, [id]);

  // Hàm xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    const { MaDM, TenDM } = formData;

    // Kiểm tra nếu mã danh mục là số âm
    if (parseInt(MaDM) < 0) {
      setError("Mã danh mục không được là số âm.");
      return;
    }

    if (!MaDM || !TenDM) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setLoading(true);
    setError(null);

    // Gọi API PUT để cập nhật danh mục
    axios
      .put(`http://localhost:5000/api/danhmucs/${id}`, { MaDM, TenDM })
      .then((response) => {
        alert("Cập nhật danh mục thành công!");
        navigate("/categorys");
      })
      .catch((error) => {
        setError(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi cập nhật danh mục."
        );
        setLoading(false);
      });
  };

  return (
    <div className="container-fluid">
      {/* Page Heading */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Cập Nhật Danh Mục Sản Phẩm</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/categorys")}
        >
          Quay Lại
        </button>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Cập Nhật Thông Tin Danh Mục
          </h6>
        </div>
        <div className="card-body">
          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Form cập nhật danh mục */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="MaDM" className="form-label">
                Mã Danh Mục
              </label>
              <input
                type="text"
                className="form-control"
                id="MaDM"
                name="MaDM"
                value={formData.MaDM}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="TenDM" className="form-label">
                Tên Danh Mục
              </label>
              <input
                type="text"
                className="form-control"
                id="TenDM"
                name="TenDM"
                value={formData.TenDM}
                onChange={handleChange}
              />
            </div>

            {/* Nút cập nhật danh mục */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>{" "}
                  Đang Lưu...
                </>
              ) : (
                "Cập Nhật Danh Mục"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;
