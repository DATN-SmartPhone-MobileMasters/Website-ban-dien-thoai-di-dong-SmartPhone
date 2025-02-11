import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { message } from "antd";

const CategoryAdd = () => {
  const API_URL = "http://localhost:5000/api/danhmucs"; // API thêm danh mục
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  // Hàm xử lý gửi form
  const onSubmit = async (data) => {
    try {
      const newCategory = {
        MaDM: Date.now().toString(), // Tạo mã danh mục tự động
        TenDM: data.TenDM,
      };

      await axios.post(API_URL, newCategory);
      message.success("Thêm danh mục thành công!");
      navigate("/categorys");
    } catch (error) {
      message.error("Thêm danh mục thất bại!");
      console.error(error.response);
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
