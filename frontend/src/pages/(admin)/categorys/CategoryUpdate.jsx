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

  const [danhMuc, setDanhMuc] = useState(null); // State để lưu danh mục
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái loading

  // Lấy thông tin danh mục
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`); // Lấy thông tin danh mục
        if (res.data && res.data.data) {
          setDanhMuc(res.data.data); // Lưu dữ liệu vào state
          reset({
            MaDM: res.data.data.MaDM,
            TenDM: res.data.data.TenDM,
          });
        } else {
          message.error("Không tìm thấy danh mục");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error.response || error.message);
        message.error("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false); // Set loading false sau khi tải dữ liệu
      }
    };
    fetchCategory();
  }, [id, reset]);

  // Xử lý cập nhật danh mục
  const onSubmit = async (data) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data);
      message.success("Cập nhật thành công");
      navigate("/categorys"); // Điều hướng về danh sách danh mục
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error.response || error.message);
      message.error("Cập nhật thất bại");
    }
  };

  // Hiển thị khi dữ liệu đang tải
  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  // Kiểm tra nếu không có danh mục
  if (!danhMuc) {
    return <div>Danh mục không tồn tại!</div>;
  }

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
              <label htmlFor="MaDM">Mã danh mục</label>
              <input
                type="text"
                className="form-control"
                id="MaDM"
                defaultValue={danhMuc.MaDM}
                {...register("MaDM", {
                  required: "Mã danh mục không được bỏ trống",
                })}
              />
              <small className="text-danger">{errors.MaDM?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="TenDM">Tên danh mục</label>
              <input
                type="text"
                className="form-control"
                id="TenDM"
                defaultValue={danhMuc.TenDM}
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
