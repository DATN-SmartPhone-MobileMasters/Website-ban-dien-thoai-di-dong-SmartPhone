import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { message } from "antd";

const CategoryUpdate = () => {
  const API_URL = "http://localhost:5000/api/danhmucs"; // API lấy và cập nhật danh mục
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true); // Trạng thái loading

  // Lấy thông tin danh mục
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`); // Gọi API lấy danh mục
        if (res.data && res.data.data) {
          reset({ TenDM: res.data.data.TenDM }); // Chỉ reset Tên danh mục
        } else {
          message.error("Không tìm thấy danh mục");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error.response || error.message);
        message.error("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id, reset]);

  // Xử lý cập nhật danh mục
  const onSubmit = async (data) => {
    try {
      await axios.put(`${API_URL}/${id}`, { TenDM: data.TenDM }); // Chỉ gửi TenDM
      message.success("Cập nhật thành công");
      navigate("/categorys");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error.response || error.message);
      message.error("Cập nhật thất bại");
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Chỉnh sửa danh mục</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Cập nhật thông tin danh mục
          </h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="TenDM">Tên danh mục</label>
              <input
                type="text"
                className="form-control"
                id="TenDM"
                {...register("TenDM", {
                  required: "Tên danh mục không được bỏ trống",
                })}
              />
              <small className="text-danger">{errors.TenDM?.message}</small>
            </div>

            <div className="d-flex justify-content-between">
              <Link to="/categorys" className="btn btn-primary">
                Quay lại
              </Link>
              <button type="submit" className="btn btn-success">
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryUpdate;
