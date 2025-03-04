import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { message } from "antd";
import {
  fetchCategories,
  fetchBrands,
  fetchPromotion,
  createProducts,
} from "../../../service/api";

const ProductsAdd = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const categoriesResponse = await fetchCategories();
        const brandsResponse = await fetchBrands();
        const promotionsResponse = await fetchPromotion();

        setCategories(categoriesResponse.data.data);
        setBrands(brandsResponse.data.data);
        setPromotions(promotionsResponse.data.data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        message.error("Lỗi tải dữ liệu, vui lòng thử lại!");
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (data.GiaSP1 < 0 || data.GiaSP2 < 0 || data.GiaSP3 < 0) {
        message.error("Giá sản phẩm không được âm!");
        return;
      }
      if (data.SoLuong1 < 0 || data.SoLuong2 < 0 || data.SoLuong3 < 0) {
        message.error("Số lượng không được âm!");
        return;
      }

     
      await createProducts(data);
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
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-row">
            <div className="flex-column w-50 pr-3">
              {/* Mã sản phẩm */}
              <div className="form-group">
                <label htmlFor="MaSP">Mã sản phẩm</label>
                <input
                  type="text"
                  className="form-control"
                  id="MaSP"
                  {...register("MaSP", {
                    required: "Mã sản phẩm không được bỏ trống",
                  })}
                />
                <small className="text-danger">{errors.MaSP?.message}</small>
              </div>
  
              {/* Tên sản phẩm */}
              <div className="form-group">
                <label htmlFor="TenSP">Tên sản phẩm 1</label>
                <input
                  type="text"
                  className="form-control"
                  id="TenSP1"
                  {...register("TenSP1", {
                    required: "Tên sản phẩm không được bỏ trống",
                  })}
                />
                <small className="text-danger">{errors.TenSP?.message}</small>
              </div>
  
              {/* Giá sản phẩm */}
              <div className="form-group">
                <label htmlFor="GiaSP1">Giá cho Hình 1</label>
                <input
                  type="number"
                  className="form-control"
                  id="GiaSP1"
                  {...register("GiaSP1", { required: "Giá không được bỏ trống" })}
                />
                <small className="text-danger">{errors.GiaSP1?.message}</small>
              </div>
  
              {/* Số lượng */}
              <div className="form-group">
                <label htmlFor="SoLuong">Số lượng 1</label>
                <input
                  type="number"
                  className="form-control"
                  id="SoLuong1"
                  {...register("SoLuong1", {
                    required: "Số lượng không được bỏ trống",
                  })}
                />
              </div>
  
              {/* Mô tả sản phẩm */}
              <div className="form-group">
                <label htmlFor="ThongTinChiTiet">Thông tin chi tiết</label>
                <textarea
                  className="form-control"
                  id="ThongTinChiTiet"
                  {...register("ThongTinChiTiet", {
                    required: "Thông tin chi tiết không được bỏ trống",
                  })}
                />
                <small className="text-danger">
                  {errors.ThongTinChiTiet?.message}
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="TenSP">Tên sản phẩm 2</label>
                <input
                  type="text"
                  className="form-control"
                  id="TenSP2"
                  {...register("TenSP2", {
                    required: "Tên sản phẩm không được bỏ trống",
                  })}
                />
                <small className="text-danger">{errors.TenSP?.message}</small>
              </div>

              <div className="form-group">
                <label htmlFor="TenSP">Tên sản phẩm 3</label>
                <input
                  type="text"
                  className="form-control"
                  id="TenSP3"
                  {...register("TenSP3", {
                    required: "Tên sản phẩm không được bỏ trống",
                  })}
                />
                <small className="text-danger">{errors.TenSP?.message}</small>
              </div>

              
              <div className="form-group">
                <label htmlFor="GiaSP2">Giá cho Hình 2</label>
                <input
                  type="number"
                  className="form-control"
                  id="GiaSP2"
                  {...register("GiaSP2", { required: "Giá không được bỏ trống" })}
                />
                <small className="text-danger">{errors.GiaSP2?.message}</small>
              </div>
            </div>

            
  
            <div className="flex-column w-50 pl-3">
              
  
              
              
  
              <div className="form-group">
                <label htmlFor="GiaSP3">Giá cho Hình 3</label>
                <input
                  type="number"
                  className="form-control"
                  id="GiaSP3"
                  {...register("GiaSP3", { required: "Giá không được bỏ trống" })}
                />
                <small className="text-danger">{errors.GiaSP3?.message}</small>
              </div>
  
              <div className="form-group">
                <label htmlFor="SoLuong">Số lượng 2</label>
                <input
                  type="number"
                  className="form-control"
                  id="SoLuong2"
                  {...register("SoLuong2", {
                    required: "Số lượng không được bỏ trống",
                  })}
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="SoLuong">Số lượng 3</label>
                <input
                  type="number"
                  className="form-control"
                  id="SoLuong3"
                  {...register("SoLuong3", {
                    required: "Số lượng không được bỏ trống",
                  })}
                />
              </div>
  
              {/* Ảnh sản phẩm */}
              <div className="form-group">
                <label htmlFor="HinhAnh1">Hình ảnh 1</label>
                <input
                  type="text"
                  className="form-control"
                  id="HinhAnh1"
                  {...register("HinhAnh1", {
                    required: "Hình ảnh không được bỏ trống",
                  })}
                />
                <small className="text-danger">{errors.HinhAnh1?.message}</small>
              </div>
  
              <div className="form-group">
                <label htmlFor="HinhAnh2">Hình ảnh 2</label>
                <input
                  type="text"
                  className="form-control"
                  id="HinhAnh2"
                  {...register("HinhAnh2", {
                    required: "Hình ảnh không được bỏ trống",
                  })}
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="HinhAnh3">Hình ảnh 3</label>
                <input
                  type="text"
                  className="form-control"
                  id="HinhAnh3"
                  {...register("HinhAnh3", {
                    required: "Hình ảnh không được bỏ trống",
                  })}
                />
              </div>
  
              {/* Danh mục */}
              <div className="form-group">
                <label htmlFor="MaDM">Danh mục</label>
                <select
                  className="form-control"
                  id="MaDM"
                  {...register("MaDM", {
                    required: "Danh mục không được bỏ trống",
                  })}
                >
                  <option value="">Vui lòng chọn danh mục</option>
                  {categories.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.TenDM}
                    </option>
                  ))}
                </select>
                <small className="text-danger">{errors.MaDM?.message}</small>
              </div>
  
              {/* Thương hiệu */}
              <div className="form-group">
                <label htmlFor="MaTH">Thương hiệu</label>
                <select
                  className="form-control"
                  id="MaTH"
                  {...register("MaTH", {
                    required: "Thương hiệu không được bỏ trống",
                  })}
                >
                  <option value="">Vui lòng chọn thương hiệu</option>
                  {brands.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.TenTH}
                    </option>
                  ))}
                </select>
                <small className="text-danger">{errors.MaTH?.message}</small>
              </div>
            </div>
          </form>
  
          {/* Nút hành động */}
          <div className="d-flex justify-content-between">
            <Link to="/products" className="btn btn-primary">
              Quay lại
            </Link>
            <button type="submit" className="btn btn-success ml-3">
              Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default ProductsAdd;
