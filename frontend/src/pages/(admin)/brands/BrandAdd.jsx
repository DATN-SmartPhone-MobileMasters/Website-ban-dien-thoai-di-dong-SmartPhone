import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { message } from "antd";
import { createBrand, fetchCategories, uploadImage } from "../../../service/api";

const BrandAdd = () => {
  const {
    register,
    handleSubmit,
    setValue, 
    formState: { errors },
  } = useForm();
  const [categories, setCategories] = useState([]);
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
      setValue("HinhAnh", response.data.imageUrl); 
    } catch (error) {
      message.error("Tải ảnh lên thất bại");
    }
  };
  // Hàm xử lý gửi form
  const onSubmit = async (data) => {
    try {
      const brandData = {
        ...data,
        HinhAnh: imageUrl
      };
      
      await createBrand(brandData);
      message.success("Thêm thương hiệu thành công!");
      navigate("/admin/brands");
    } catch (error) {
      message.error("Thêm thương hiệu thất bại!");
      console.error(error.response);
    }
  };

  // Lấy danh sách danh mục từ API
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchCategories();
        setCategories(res.data.data); // Lưu danh sách danh mục vào state
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Thêm Thương Hiệu</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Thêm thương hiệu
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
                required
              />
              {imageUrl && (
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  style={{ marginTop: '10px', maxWidth: '150px' }}
                />
              )}
              <input
                type="hidden"
                {...register("HinhAnh", { required: "Vui lòng tải lên hình ảnh" })}
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
              <Link to="/admin/brands" className="btn btn-primary">
                Quay lại
              </Link>
              <button type="submit" className="btn btn-success ml-3">
                Thêm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BrandAdd;
