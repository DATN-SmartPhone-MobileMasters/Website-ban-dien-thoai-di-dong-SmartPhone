import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { message } from "antd";
const BrandAdd = () => {
  const API_URL_Cate = "/api/danhmucs";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const nav = useNavigate();
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("TenTH", data.TenTH);
      formData.append("Mota", data.Mota);
      formData.append("MaDM", data.MaDM);
      formData.append("HinhAnh", data.HinhAnh[0]); // Lưu ý khi gửi tệp tin

      await axios.post("http://localhost:5000/api/thuonghieus", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Cần chỉ định loại content
        },
      });
      message.success("Thêm thành công");
      nav("/brands");
    } catch (error) {
      message.error("Thêm thất bại");
      console.error(error.response); // In lỗi ra console để kiểm tra thêm
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(API_URL_Cate);
        setCategories(res.data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Tables</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Database thuonghieu
          </h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label htmlFor="">Tên thương hiệu</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  {...register("TenTH", {
                    required: "Tên thương hiệu không được bỏ trống",
                  })}
                />
                <small className="text-danger">{errors.TenTH?.message}</small>
              </div>
              <div className="form-group">
                <label htmlFor="">Hình ảnh</label>
                <input
                  type="file"
                  className="form-control"
                  placeholder=""
                  {...register("HinhAnh", {
                    required: "Hình ảnh không được bỏ trống",
                  })}
                />
                <small className="text-danger">{errors.HinhAnh?.message}</small>
              </div>
              <div className="form-group">
                <label htmlFor="">Mô tả</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  {...register("Mota", {
                    required: "Mô tả không được bỏ trống",
                  })}
                />
                <small className="text-danger">{errors.Mota?.message}</small>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="">
                  Danh mục
                </label>
                <select
                  className="form-control"
                  {...register("MaDM", {
                    required: "Danh mục không được bỏ trống",
                  })}
                  id=""
                >
                  {categories.map((danhmucs) => (
                    <option key={danhmucs._id} value={danhmucs._id}>
                      {danhmucs.TenDM}
                    </option>
                  ))}
                </select>
                <small className="text-danger">{errors.MaDM?.message}</small>
              </div>
              <Link to={`/brands`}>
                <button className="btn btn-primary">Back to list</button>
              </Link>
              <button className="btn btn-dark ml-3">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandAdd;
