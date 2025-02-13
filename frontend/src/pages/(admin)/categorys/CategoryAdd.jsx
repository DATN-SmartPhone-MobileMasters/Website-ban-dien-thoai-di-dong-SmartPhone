import React from "react";
import { data, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { message } from "antd";
import { createCategory } from "../../../service/api"; // Dùng API từ service

const CategoryAdd = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  // Xử lý khi gửi form
  const onSubmit = async (data) => {
    console.log("Dữ liệu gửi lên API:", data); // Kiểm tra dữ liệu React gửi
    try {
      await createCategory({ TenDM: data.TenDM });
      message.success("Thêm danh mục thành công!");
      navigate("/categorys");
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error.response?.data || error);
      message.error(error.response?.data?.message || "Thêm danh mục thất bại!");
    }
  };

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Thêm Danh Mục</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Thêm danh mục</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Tên danh mục */}
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

            {/* Nút hành động */}
            <div className="d-flex justify-content-between">
              <Link to="/categorys" className="btn btn-secondary">
                Quay lại
              </Link>
              <button type="submit" className="btn btn-success">
                Thêm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryAdd;
