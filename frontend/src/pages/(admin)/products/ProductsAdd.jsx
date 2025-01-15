import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const ProductsAdd = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/sanphams", data);
      alert("Thêm sản phẩm thành công!");
      navigate("/ProductsList");
    } catch (err) {
      setError(err);
      console.log("Lỗi khi thêm sản phẩm", err);
      alert("Có lỗi xảy ra khi thêm sản phẩm!");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Đang thêm sản phẩm...</p>;
  if (error) return <p>Có lỗi xảy ra: {error.message}</p>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Thêm sản phẩm mới</h2>
        <Link to="/ProductsList">
          <button className="btn btn-secondary">
            <i ></i> Quay lại
          </button>
        </Link>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
          <label>MaSP</label>
          <input
            type="text"
            {...register("MaSP", { required: "Mã sản phẩm là bắt buộc" })}
            className="form-control"
          />
          {errors.MaSP && <small className="text-danger">{errors.MaSP.message}</small>}
        </div>
        <div className="form-group">
          <label>MaTH</label>
          <input
            type="text"
            {...register("MaTH", { required: "Mã thể loại là bắt buộc", })}
            className="form-control"
          />
          {errors.MaTH && <small className="text-danger">{errors.MaTH.message}</small>}
        </div>
        <div className="form-group">
          <label>MaDM</label>
          <input
            type="text"
            {...register("MaDM", { required: "Mã danh mục là bắt buộc" })}
            className="form-control"
          />
          {errors.MaDM && <small className="text-danger">{errors.MaDM.message}</small>}
        </div>
        <div className="form-group">
          <label>MaKM</label>
          <input
            type="text"
            {...register("MaKM", { required: "Mã khuyến mãi là bắt buộc" })}
            className="form-control"
          />
          {errors.MaKM && <small className="text-danger">{errors.MaKM.message}</small>}
        </div>
        <div className="form-group">
          <label>TenSP</label>
          <input
            type="text"
            {...register("TenSP", { required: "Tên sản phẩm là bắt buộc" })}
            className="form-control"
          />
          {errors.TenSP && <small className="text-danger">{errors.TenSP.message}</small>}
        </div>
        <div className="form-group">
          <label>GiaSP</label>
          <input
            type="number"
            {...register("GiaSP", { required: "Giá sản phẩm là bắt buộc" })}
            className="form-control"
          />
          {errors.GiaSP && <small className="text-danger">{errors.GiaSP.message}</small>}
        </div>
        <div className="form-group">
          <label>SoLuong</label>
          <input
            type="number"
            {...register("SoLuong", { required: "Số lượng sản phẩm là bắt buộc" })}
            className="form-control"
          />
          {errors.SoLuong && <small className="text-danger">{errors.SoLuong.message}</small>}
        </div>
        <div className="form-group">
          <label>HinhAnh1</label>
          <input
            type="text"
            {...register("HinhAnh1", { required: "Hình ảnh là bắt buộc" })}
            className="form-control"
          />
          {errors.HinhAnh1 && <small className="text-danger">{errors.HinhAnh1.message}</small>}
        </div>
        <div className="form-group">
          <label>BoNhoTrong</label>
          <input
            type="text"
            {...register("BoNhoTrong", { required: "Bộ nhớ trong là bắt buộc" })}
            className="form-control"
          />
          {errors.BoNhoTrong && <small className="text-danger">{errors.BoNhoTrong.message}</small>}
        </div>
        <div className="form-group">
          <label>Mau</label>
          <input
            type="text"
            {...register("Mau", { required: "Màu sắc là bắt buộc" })}
            className="form-control"
          />
          {errors.Mau && <small className="text-danger">{errors.Mau.message}</small>}
        </div>
        <div className="form-group">
          <label>ManHinh</label>
          <input
            type="text"
            {...register("ManHinh", { required: "Màn hình là bắt buộc" })}
            className="form-control"
          />
          {errors.ManHinh && <small className="text-danger">{errors.ManHinh.message}</small>}
        </div>
        <div className="form-group">
          <label>MoTa</label>
          <textarea
            {...register("MoTa", { required: "Mô tả là bắt buộc" })}
            className="form-control"
          />
          {errors.MoTa && <small className="text-danger">{errors.MoTa.message}</small>}
        </div>

        <button type="submit" className="btn btn-primary">Thêm sản phẩm</button>
      </form>
    </div>
  );
};

export default ProductsAdd;
