import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { message } from "antd";
import { fetchCategories, getBrandById, updateBrand,uploadImage } from "../../../service/api";

const BrandEdit = () => {
  const [categories, setCategories] = useState([]); 
  const {
    reset,
    register,
    handleSubmit,
    setValue, 
    formState: { errors },
  } = useForm();
  const { id } = useParams(); 
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const response = await uploadImage(formData);
      setImageUrl(response.data.imageUrl);
      setValue("HinhAnh", response.data.imageUrl); // Add setValue
    } catch (error) {
      message.error("Tải ảnh lên thất bại");
    }
  };

  // Lấy thông tin thương hiệu và danh mục
  useEffect(() => {
    (async () => {
      try {
        const [brandRes, categoryRes] = await Promise.all([
          getBrandById(id), // Lấy thông tin thương hiệu
          fetchCategories(), // Lấy danh sách danh mục
        ]);
        setImageUrl(brandRes.data.data.HinhAnh);
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
      const brandData = {
        ...data,
        HinhAnh: imageUrl 
      };
      await updateBrand(id,brandData);
      message.success("Cập nhật thành công");
      navigate("/admin/brands");
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
                type="file"
                className="form-control"
                onChange={handleImageUpload}
                accept="image/*"
              />
              {imageUrl && (
                <div className="mt-2">
                  <img 
                    src={imageUrl} 
                    alt="Current" 
                    style={{ maxWidth: '150px' }}
                  />
                  <div className="text-muted small mt-1">Ảnh hiện tại</div>
                </div>
              )}
              <input
                type="hidden"
                {...register("HinhAnh")}
                value={imageUrl}
              />
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
              <Link to="/admin/brands" className="btn btn-primary">
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
