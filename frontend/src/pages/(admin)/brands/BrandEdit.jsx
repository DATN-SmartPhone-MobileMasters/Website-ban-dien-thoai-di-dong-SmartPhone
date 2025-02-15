import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { message } from "antd";
import { fetchCategories, getBrandById } from "../../../service/api";

const BrandEdit = () => {
  const API_URL_Cate = "http://localhost:5000/api/danhmucs"; // API lấy danh mục
  const API_URL = "http://localhost:5000/api/thuonghieus"; // API lấy và cập nhật thương hiệu
  const [categories, setCategories] = useState([]); // Lưu danh sách danh mục
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();

  // Lấy thông tin thương hiệu và danh mục
  useEffect(() => {
    (async () => {
      try {
        const [brandRes, categoryRes] = await Promise.all([
          getBrandById(id), // Lấy thông tin thương hiệu
          fetchCategories(), // Lấy danh sách danh mục
        ]);

        setCategories(categoryRes.data.data); // Lưu danh mục vào state

        reset({
          TenTH: brandRes.data.data.TenTH,
          HinhAnh: brandRes.data.data.HinhAnh,
          Mota: brandRes.data.data.Mota,
          MaDM: brandRes.data.data.MaDM.map((dm) => dm._id), // Lấy danh sách ID của danh mục
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    })();
  }, [id, reset]);

  // Xử lý cập nhật thương hiệu
  const onSubmit = async (data) => {
    try {
      await axios.put(`${API_URL}/${id}`, data);
      message.success("Cập nhật thành công");
      navigate("/brands"); // Điều hướng về danh sách thương hiệu
    } catch (error) {
      message.error("Cập nhật thất bại");
      console.error("Lỗi khi cập nhật:", error.response);
    }
  };

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Chỉnh sửa thương hiệu</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Cập nhật thông tin thương hiệu
          </h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="TenTH">Tên thương hiệu</label>
              <input
                type="text"
                className="form-control"
                id="TenTH"
                {...register("TenTH", {
                  required: "Tên thương hiệu không được bỏ trống",
                })}
              />
              <small className="text-danger">{errors.TenTH?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="HinhAnh">Hình ảnh</label>
              <input
                type="text"
                className="form-control"
                id="HinhAnh"
                {...register("HinhAnh", {
                  required: "Hình ảnh không được bỏ trống",
                })}
              />
              <small className="text-danger">{errors.HinhAnh?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="Mota">Mô tả</label>
              <input
                type="text"
                className="form-control"
                id="Mota"
                {...register("Mota", {
                  required: "Mô tả không được bỏ trống",
                })}
              />
              <small className="text-danger">{errors.Mota?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="MaDM">Danh mục</label>
              <select
                className="form-control"
                id="MaDM"
                multiple // Cho phép chọn nhiều danh mục
                {...register("MaDM", {
                  required: "Danh mục không được bỏ trống",
                })}
              >
                {categories.map((danhmuc) => (
                  <option key={danhmuc._id} value={danhmuc._id}>
                    {danhmuc.TenDM}
                  </option>
                ))}
              </select>
              <small className="text-danger">{errors.MaDM?.message}</small>
            </div>

            <div className="">
              <Link to="/brands" className="btn btn-primary">
                Quay lại
              </Link>
              <button type="submit" className="btn btn-success ml-3">
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BrandEdit;
