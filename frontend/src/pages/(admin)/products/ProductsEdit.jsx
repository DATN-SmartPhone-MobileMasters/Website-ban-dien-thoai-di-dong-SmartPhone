import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { message } from "antd";

const ProductsEdit = () => {
  const API_URL_Categories = "http://localhost:5000/api/danhmucs"; 
  const API_URL_Products = "http://localhost:5000/api/sanphams"; 
  const API_URL_Discounts = "http://localhost:5000/api/Promotions"; 
  const API_URL_Brands = "http://localhost:5000/api/thuonghieus"; 
  const [categories, setCategories] = useState([]); 
  const [discounts, setDiscounts] = useState([]); 
  const [brands, setBrands] = useState([]); 
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { id } = useParams(); 
  const navigate = useNavigate();

 
  useEffect(() => {
    (async () => {
      try {
        const [productRes, categoryRes, discountRes, brandRes] = await Promise.all([
          axios.get(`${API_URL_Products}/${id}`), 
          axios.get(API_URL_Categories), 
          axios.get(API_URL_Discounts), 
          axios.get(API_URL_Brands),
        ]);

        setCategories(categoryRes.data.data); 
        setDiscounts(discountRes.data.data); 
        setBrands(brandRes.data.data); 
        reset({
          TenSP: productRes.data.data.TenSP,
          GiaSP: productRes.data.data.GiaSP,
          SoLuong: productRes.data.data.SoLuong,
          HinhAnh1: productRes.data.data.HinhAnh1,
          HinhAnh2: productRes.data.data.HinhAnh2,
          HinhAnh3: productRes.data.data.HinhAnh3,
          MaDM: productRes.data.data.MaDM?._id, 
          MaKM: productRes.data.data.MaKM?._id, 
          MaTH: productRes.data.data.MaTH?._id, 
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    })();
  }, [id, reset]);


  const onSubmit = async (data) => {
    // Kiểm tra giá và số lượng không được âm
    if (data.GiaSP < 0) {
      message.error("Giá sản phẩm không thể là số âm!");
      return;
    }
  
    if (data.SoLuong < 0) {
      message.error("Số lượng sản phẩm không thể là số âm!");
      return;
    }
  
    try {
      await axios.put(`${API_URL_Products}/${id}`, data);
      message.success("Cập nhật sản phẩm thành công");
      navigate("/products"); 
    } catch (error) {
      message.error("Cập nhật sản phẩm thất bại");
      console.error("Lỗi khi cập nhật:", error.response);
    }
  };
  

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Chỉnh sửa sản phẩm</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Cập nhật thông tin sản phẩm
          </h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="TenSP">Tên sản phẩm</label>
              <input
                type="text"
                className="form-control"
                id="TenSP"
                {...register("TenSP", {
                  required: "Tên sản phẩm không được bỏ trống",
                })}
              />
              <small className="text-danger">{errors.TenSP?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="GiaSP">Giá sản phẩm</label>
              <input
                type="number"
                className="form-control"
                id="GiaSP"
                {...register("GiaSP", {
                  required: "Giá sản phẩm không được bỏ trống",
                })}
              />
              <small className="text-danger">{errors.GiaSP?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="SoLuong">Số lượng</label>
              <input
                type="number"
                className="form-control"
                id="SoLuong"
                {...register("SoLuong", {
                  required: "Số lượng không được bỏ trống",
                })}
              />
              <small className="text-danger">{errors.SoLuong?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="HinhAnh1">Hình ảnh 1</label>
              <input
                type="text"
                className="form-control"
                id="HinhAnh1"
                {...register("HinhAnh1", {
                  required: "Hình ảnh 1 không được bỏ trống",
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
                  required: "Hình ảnh 2 không được bỏ trống",
                })}
              />
              <small className="text-danger">{errors.HinhAnh2?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="HinhAnh3">Hình ảnh 3</label>
              <input
                type="text"
                className="form-control"
                id="HinhAnh3"
                {...register("HinhAnh3", {
                  required: "Hình ảnh 3 không được bỏ trống",
                })}
              />
              <small className="text-danger">{errors.HinhAnh3?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="MaDM">Danh mục</label>
              <select
                className="form-control"
                id="MaDM"
                {...register("MaDM", {
                  required: "Danh mục không được bỏ trống",
                })}
              >
                <option value="" disabled>
                  Vui lòng chọn danh mục
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.TenDM}
                  </option>
                ))}
              </select>
              <small className="text-danger">{errors.MaDM?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="MaKM">Khuyến mãi</label>
              <select
                className="form-control"
                id="MaKM"
                {...register("MaKM", {
                  required: "Khuyến mãi không được bỏ trống",
                })}
              >
                <option value="" disabled>
                  Vui lòng chọn khuyến mãi
                </option>
                {discounts.map((discount) => (
                  <option key={discount._id} value={discount._id}>
                    {discount.TenKM}
                  </option>
                ))}
              </select>
              <small className="text-danger">{errors.MaKM?.message}</small>
            </div>

            <div className="form-group">
              <label htmlFor="MaTH">Thương hiệu</label>
              <select
                className="form-control"
                id="MaTH"
                {...register("MaTH", {
                  required: "Thương hiệu không được bỏ trống",
                })}
              >
                <option value="" disabled>
                  Vui lòng chọn thương hiệu
                </option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.TenTH}
                  </option>
                ))}
              </select>
              <small className="text-danger">{errors.MaTH?.message}</small>
            </div>

            <div className="d-flex justify-content-between">
              <Link to="/products" className="btn btn-primary">
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

export default ProductsEdit;
