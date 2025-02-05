import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { message } from "antd";

const ProductsAdd = () => {
  const API_URL_CATEGORIES = "http://localhost:5000/api/danhmucs";
  const API_URL_BRANDS = "http://localhost:5000/api/thuonghieus";
  const API_URL_PROMOTIONS = "http://localhost:5000/api/Promotions";
  const API_URL_PRODUCTS = "http://localhost:5000/api/sanphams";

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [promotions, setPromotions] = useState([]);

  // Lấy dữ liệu từ API
  const fetchData = async () => {
    try {
      const categoriesResponse = await axios.get(API_URL_CATEGORIES);
      const brandsResponse = await axios.get(API_URL_BRANDS);
      const promotionsResponse = await axios.get(API_URL_PROMOTIONS);

      setCategories(categoriesResponse.data.data);
      setBrands(brandsResponse.data.data);
      setPromotions(promotionsResponse.data.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      message.error("Lỗi tải dữ liệu, vui lòng thử lại!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const onSubmit = async (data) => {
  
    if (data.GiaSP < 0) {
      message.error("Giá sản phẩm không thể là số âm!");
      return;
    }
  
    if (data.SoLuong < 0) {
      message.error("Số lượng sản phẩm không thể là số âm!");
      return;
    }
  
    try {
      await axios.post(API_URL_PRODUCTS, data);
      message.success("Thêm sản phẩm thành công!");
      navigate("/products");
    } catch (error) {
      message.error("Thêm sản phẩm thất bại!");
      console.error(error.response);
    }
  };
  

  return (
    <div>

      <h1 className="h3 mb-2 text-gray-800">Thêm Sản Phẩm</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Thêm sản phẩm</h6>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Thêm sản phẩm mới</h2>
        <Link to="/products">
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
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="TenSP">Tên sản phẩm</label>
              <input
                type="text"
                className="form-control"
                id="TenSP"
                {...register("TenSP", { required: "Tên sản phẩm không được bỏ trống" })}
              />
              <small className="text-danger">{errors.TenSP?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="GiaSP">Giá sản phẩm</label>
              <input
                type="number"
                className="form-control"
                id="GiaSP"
                {...register("GiaSP", { required: "Giá sản phẩm không được bỏ trống" })}
              />
              <small className="text-danger">{errors.GiaSP?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="SoLuong">Số lượng</label>
              <input
                type="number"
                className="form-control"
                id="SoLuong"
                {...register("SoLuong", { required: "Số lượng không được bỏ trống" })}
              />
              <small className="text-danger">{errors.SoLuong?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="HinhAnh1">Hình ảnh 1</label>
              <input
                type="text"
                className="form-control"
                id="HinhAnh1"
                {...register("HinhAnh1", { required: "Hình ảnh không được bỏ trống" })}
              />
              <small className="text-danger">{errors.HinhAnh1?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="HinhAnh2">Hình ảnh 2</label>
              <input
                type="text"
                className="form-control"
                id="HinhAnh2"
                {...register("HinhAnh2", { required: "Hình ảnh không được bỏ trống" })}
              />
              <small className="text-danger">{errors.HinhAnh2?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="HinhAnh3">Hình ảnh 3</label>
              <input
                type="text"
                className="form-control"
                id="HinhAnh3"
                {...register("HinhAnh3", { required: "Hình ảnh không được bỏ trống" })}
              />
              <small className="text-danger">{errors.HinhAnh3?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="MaDM">Danh mục</label>
              <select className="form-control" id="MaDM" {...register("MaDM", { required: "Danh mục không được bỏ trống" })}>
                <option value="" selected disabled>Vui lòng chọn danh mục</option>
                {categories.map((danhmuc) => (
                  <option key={danhmuc._id} value={danhmuc._id}>{danhmuc.TenDM}</option>
                ))}
              </select>
              <small className="text-danger">{errors.MaDM?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="MaTH">Thương hiệu</label>
              <select className="form-control" id="MaTH" {...register("MaTH", { required: "Thương hiệu không được bỏ trống" })}>
                <option value="" selected disabled>Vui lòng chọn thương hiệu</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>{brand.TenTH}</option>
                ))}
              </select>
              <small className="text-danger">{errors.MaTH?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="MaKM">Khuyến mãi</label>
              <select className="form-control" id="MaKM" {...register("MaKM")}>
                <option value="">Không có khuyến mãi</option>
                {promotions.map((promo) => (
                  <option key={promo._id} value={promo._id}>{promo.TenKM}</option>
                ))}
              </select>
            </div>

            <div className="">
              <Link to="/products" className="btn btn-primary">Quay lại</Link>
              <button type="submit" className="btn btn-success ml-3">Thêm</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductsAdd;
