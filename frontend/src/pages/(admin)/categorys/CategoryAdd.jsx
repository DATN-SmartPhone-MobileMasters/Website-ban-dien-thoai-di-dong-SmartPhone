import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { message } from "antd";
import { createCategory, fetchCategories } from "../../../service/api"; // Thêm hàm fetchCategories
import PermissionCheck from "../../../service/PermissionCheck";

const CategoryAdd = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const navigate = useNavigate();
  const [existingCategories, setExistingCategories] = useState([]);

  // Load danh sách danh mục khi component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        setExistingCategories(res.data.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách danh mục:", error);
      }
    };
    loadCategories();
  }, []);

  const onSubmit = async (data) => {
    // Kiểm tra trùng tên phía client
    const isDuplicate = existingCategories.some(
      (cat) => cat.TenDM.toLowerCase() === data.TenDM.trim().toLowerCase()
    );

    if (isDuplicate) {
      setError("TenDM", {
        type: "manual",
        message: "Tên danh mục đã tồn tại",
      });
      return;
    }

    try {
      await createCategory({ TenDM: data.TenDM.trim() });
      message.success("Thêm danh mục thành công!");
      navigate("/admin/categorys");
    } catch (error) {
      // Xử lý lỗi từ server
      if (error.response?.data?.message?.includes("duplicate")) {
        setError("TenDM", {
          type: "manual",
          message: "Tên danh mục đã tồn tại",
        });
      } else {
        message.error(
          error.response?.data?.message || "Thêm danh mục thất bại!"
        );
      }
    }
  };

  return (
    <>
    <PermissionCheck requiredPermission={1} redirectPath="/admin/categorys" />
    <div>
      <h1 className="h3 mb-2 text-gray-800">Thêm Danh Mục</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Thêm danh mục</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="TenDM">Tên danh mục</label>
              <input
                type="text"
                className={`form-control ${errors.TenDM ? "is-invalid" : ""}`}
                id="TenDM"
                {...register("TenDM", {
                  required: "Tên danh mục không được bỏ trống",
                  validate: (value) => {
                    const formattedValue = value.trim().toLowerCase();
                    return (
                      !existingCategories.some(
                        (cat) => cat.TenDM.toLowerCase() === formattedValue
                      ) || "Tên danh mục đã tồn tại"
                    );
                  },
                })}
              />
              {errors.TenDM && (
                <div className="invalid-feedback">{errors.TenDM.message}</div>
              )}
            </div>

            <div className="d-flex justify-content-between">
              <Link to="/admin/categorys" className="btn btn-secondary">
                Quay lại
              </Link>
              <button type="submit" className="btn btn-success">
                Thêm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default CategoryAdd;
