import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    MaDM: "",
    TenDM: "",
  });
  const [error, setError] = useState(null); // Để hiển thị lỗi
  const [loading, setLoading] = useState(false); // Để hiển thị trạng thái loading
  const navigate = useNavigate();

  // Hàm xử lý khi form thay đổi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
      setError("Vui lòng điền đầy đủ thông tin trước khi thêm.");
      return;
    }

    setLoading(true);
    setError(null);

    // Gửi dữ liệu lên API
    axios
      .post("http://localhost:5000/api/danhmucs", { MaDM, TenDM })
      .then((response) => {
        alert("Thêm danh mục thành công!");
        navigate("/categorys");
      })
      .catch((error) => {
        setError(
          error.response?.data?.message || "Có lỗi xảy ra khi thêm danh mục."
        );
        console.log(error.response.data);
        console.error(error.response);
        setLoading(false);
      });
  };

  return (
    <div className="container-fluid">
      {/* Page Heading */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Thêm Danh Mục Sản Phẩm</h1>
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
            Điền Thông Tin Danh Mục
          </h6>
        </div>
        <div className="card-body">
          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Form thêm danh mục */}
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

            {/* Nút thêm danh mục */}
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
                "Thêm Danh Mục"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
