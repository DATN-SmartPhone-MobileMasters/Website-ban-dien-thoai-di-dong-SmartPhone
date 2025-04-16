import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { message } from "antd";
import {
  createBanner,
  fetchBanners,
  getBannerById,
  updateBanner,
  uploadImage,
} from "../../../service/api";

const BannerEdit = () => {
  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [existingBanners, setExistingBanners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await fetchBanners();
        setExistingBanners(res.data.data);
      } catch (error) {
        console.error("Error loading banners:", error);
      }
    };
    loadBanners();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await uploadImage(formData);
      setImageUrl(response.data.imageUrl);
      setValue("imgUrl", response.data.imageUrl);
    } catch (error) {
      message.error("Tải ảnh lên thất bại");
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const [bannerRes] = await Promise.all([getBannerById(id)]);
        setImageUrl(bannerRes.data.data.imgUrl);

        reset({
          imgUrl: bannerRes.data.data.imgUrl,
          status: bannerRes.data.data.status,
        });
      } catch (error) {
        console.error("Error loading data:", error);
      }
    })();
  }, [id, reset]);
  const onSubmit = async (data) => {
    const bannerData = {
      ...data,
      imgUrl: imageUrl,
    };

    try {
      await updateBanner(id, bannerData);
      message.success("Sửa banner thành công!");
      navigate("/admin/banners");
    } catch (error) {
      message.error("Sửa banner thất bại!");
      console.error(error.response);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="h3 mb-4 text-center text-primary">Sửa Banner</h1>
      <div className="card shadow-lg">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Hình ảnh */}
            <div className="form-group mb-4">
              <label htmlFor="imgUrl" className="form-label">
                Hình ảnh
              </label>
              <input
                type="file"
                className="form-control"
                onChange={handleImageUpload}
                accept="image/*"
              />
              {imageUrl && (
                <div className="mt-3">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="img-thumbnail"
                    style={{ maxWidth: "200px" }}
                  />
                </div>
              )}
              <input
                type="hidden"
                {...register("imgUrl", {
                  required: "Vui lòng tải lên hình ảnh",
                })}
              />
              <small className="text-danger">{errors.imgUrl?.message}</small>
            </div>

            {/* Trạng thái */}
            <div className="form-group mb-4">
              <label htmlFor="status" className="form-label">
                Trạng thái
              </label>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="status"
                  {...register("status")}
                />
                <label htmlFor="status" className="form-check-label">
                  Kích hoạt
                </label>
              </div>
              <small className="text-danger">{errors.status?.message}</small>
            </div>

            {/* Nút hành động */}
            <div className="d-flex justify-content-between">
              <Link to="/admin/banners" className="btn btn-secondary">
                <i className="bi bi-arrow-left"></i> Quay lại
              </Link>
              <button type="submit" className="btn btn-success">
                <i className="bi bi-plus-circle"></i> Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BannerEdit;
