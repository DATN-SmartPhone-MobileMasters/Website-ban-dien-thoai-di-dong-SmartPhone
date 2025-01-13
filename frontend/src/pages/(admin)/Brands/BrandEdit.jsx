import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { message } from "antd";
const BrandEdit = () => {
  const API_URL_Cate = "/api/danhmucs";
  const API_URL = "/api/thuonghieus";
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { _id } = useParams();
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/${_id}`);
        reset(res.data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [_id, reset]);
  const [categories, setCategories] = useState([]);
  const nav = useNavigate();
  const onSubmit = async (data) => {
    const { _id, updated_at, created_at, __v, ...updateData } = data;
    try {
      await axios.put("/api/thuonghieus/" + _id, updateData, {
        headers: {
          "Content-Type": "application/json", // Cần chỉ định loại content
        },
      });
      message.success("Cập nhật thành công");
      nav("/brands");
    } catch (error) {
      message.error("Cập nhật thất bại");
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

export default BrandEdit;
