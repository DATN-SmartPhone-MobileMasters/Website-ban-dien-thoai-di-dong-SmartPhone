import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const AddPromotion = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/promotions", data);
      confirmAlert({
        title: "Thành công!",
        message: "Thêm khuyến mãi thành công!",
        buttons: [
          {
            label: "OK",
            onClick: () => navigate("/vouchers"),
          },
        ],
        closeOnEscape: true,
        closeOnClickOutside: true,
      });
    } catch (error) {
      confirmAlert({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Có lỗi xảy ra khi thêm khuyến mãi.",
        buttons: [
          {
            label: "OK",
            onClick: () => {},
          },
        ],
        closeOnEscape: true,
        closeOnClickOutside: true,
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Thêm Khuyến Mãi</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/vouchers")}
        >
          Quay Lại
        </button>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Điền Thông Tin Khuyến Mãi
          </h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="MaKM" className="form-label">
                Mã Khuyến Mãi
              </label>
              <input
                type="number"
                className={`form-control ${errors.MaKM ? "is-invalid" : ""}`}
                id="MaKM"
                {...register("MaKM", {
                  required: "Mã khuyến mãi là trường bắt buộc",
                })}
              />
              {errors.MaKM && (
                <div className="invalid-feedback">{errors.MaKM.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="TenKM" className="form-label">
                Tên Khuyến Mãi
              </label>
              <input
                type="text"
                className={`form-control ${errors.TenKM ? "is-invalid" : ""}`}
                id="TenKM"
                {...register("TenKM", {
                  required: "Tên khuyến mãi là trường bắt buộc",
                })}
              />
              {errors.TenKM && (
                <div className="invalid-feedback">{errors.TenKM.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="LoaiKM" className="form-label">
                Loại Khuyến Mãi
              </label>
              <select
                className={`form-control ${errors.LoaiKM ? "is-invalid" : ""}`}
                id="LoaiKM"
                {...register("LoaiKM", {
                  required: "Loại khuyến mãi là trường bắt buộc",
                })}
              >
                <option value="">Chọn loại khuyến mãi</option>
                <option value="fixed">Giảm số tiền cố định</option>
                <option value="percentage">Giảm theo %</option>
              </select>
              {errors.LoaiKM && (
                <div className="invalid-feedback">{errors.LoaiKM.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="GiaTriKM" className="form-label">
                Giá Trị Khuyến Mãi
              </label>
              <input
                type="number"
                className={`form-control ${
                  errors.GiaTriKM ? "is-invalid" : ""
                }`}
                id="GiaTriKM"
                step={watch("LoaiKM") === "percentage" ? "1" : "any"}
                {...register("GiaTriKM", {
                  required: "Giá trị khuyến mãi là trường bắt buộc",
                  min: { value: 0, message: "Giá trị không được là số âm" },
                  max:
                    watch("LoaiKM") === "percentage"
                      ? { value: 100, message: "Không lớn hơn 100%" }
                      : undefined,
                  validate: (value) =>
                    watch("LoaiKM") === "percentage" &&
                    !Number.isInteger(Number(value))
                      ? "Không được nhập số thập phân khi giảm theo kiểu %"
                      : true,
                })}
              />
              {errors.GiaTriKM && (
                <div className="invalid-feedback">
                  {errors.GiaTriKM.message}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="NgayBD" className="form-label">
                Ngày Bắt Đầu
              </label>
              <input
                type="date"
                className={`form-control ${errors.NgayBD ? "is-invalid" : ""}`}
                id="NgayBD"
                {...register("NgayBD", {
                  required: "Ngày bắt đầu là trường bắt buộc",
                })}
              />
              {errors.NgayBD && (
                <div className="invalid-feedback">{errors.NgayBD.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="NgayKT" className="form-label">
                Ngày Kết Thúc
              </label>
              <input
                type="date"
                className={`form-control ${errors.NgayKT ? "is-invalid" : ""}`}
                id="NgayKT"
                {...register("NgayKT", {
                  required: "Ngày kết thúc là trường bắt buộc",
                })}
              />
              {errors.NgayKT && (
                <div className="invalid-feedback">{errors.NgayKT.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="TrangThai" className="form-label">
                Trạng Thái
              </label>
              <select
                className={`form-control ${
                  errors.TrangThai ? "is-invalid" : ""
                }`}
                id="TrangThai"
                {...register("TrangThai", {
                  required: "Trạng thái là trường bắt buộc",
                })}
              >
                <option value="">Chọn trạng thái</option>
                <option value="0">Đang diễn ra</option>
                <option value="1">Kết thúc</option>
                <option value="2">Chưa bắt đầu</option>
              </select>
              {errors.TrangThai && (
                <div className="invalid-feedback">
                  {errors.TrangThai.message}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              Thêm Khuyến Mãi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPromotion;
