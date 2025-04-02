import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { deletePromotion, fetchPromotion } from "../../../service/api";

const statusMap = {
  0: "🔵 Đang diễn ra",
  1: "🔴 Đã sử dụng",
  2: "🟡 Chưa bắt đầu",
};

// Hàm định dạng ngày theo DD/MM/YYYY
const formatDate = (dateString) => {
  if (!dateString) return "Không xác định";
  return new Intl.DateTimeFormat("vi-VN").format(new Date(dateString));
};

const Promotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getPromotions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchPromotion();
      setPromotions(response.data?.data || []);
    } catch (error) {
      setError("Có lỗi khi lấy dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getPromotions();
  }, [getPromotions]);

  const promotionsList = useMemo(() => {
    return promotions.map((promotion) => ({
      ...promotion,
      TrangThaiText: statusMap[promotion.TrangThai] || "⚪ Không xác định",
      NgayBDText: formatDate(promotion.NgayBD),
      NgayKTText: formatDate(promotion.NgayKT),
      LoaiKMText:
        promotion.LoaiKM === "percentage"
          ? "Giảm theo %"
          : "Giảm số tiền cố định",
      GiaTriKMText:
        promotion.LoaiKM === "percentage"
          ? `${promotion.GiaTriKM}%`
          : `${promotion.GiaTriKM} VND`,
    }));
  }, [promotions]);

  const handleDelete = useCallback((id) => {
    confirmAlert({
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa khuyến mãi này?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            try {
              await deletePromotion(id);
              setPromotions((prev) =>
                prev.filter((promotion) => promotion._id !== id)
              );
            } catch (error) {
              alert("Có lỗi xảy ra khi xóa khuyến mãi.");
            }
          },
        },
        { label: "Không" },
      ],
    });
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Danh Sách Khuyến Mãi</h1>
        <div>
          <button
            className="btn btn-secondary me-2"
            onClick={getPromotions}
            disabled={loading}
          >
            {loading ? "⏳ Đang tải..." : "🔄 Làm mới"}
          </button>
          <Link className="btn btn-primary" to="/admin/vouchers/add">
            ➕ Thêm Khuyến Mãi
          </Link>
        </div>
      </div>
      <p className="mb-4">
        Đây là danh sách tất cả các khuyến mãi trong hệ thống.
      </p>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Khuyến Mãi</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            {loading && (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            {error && !loading && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {!loading && !error && (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Mã KM</th>
                    <th>Tên KM</th>
                    <th>Loại KM</th>
                    <th>Giá Trị KM</th>
                    <th>Ngày Bắt Đầu</th>
                    <th>Ngày Kết Thúc</th>
                    <th>Trạng Thái</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {promotionsList.length > 0 ? (
                    promotionsList.map((promotion) => (
                      <tr key={promotion._id}>
                        <td>{promotion.MaKM}</td>
                        <td>{promotion.TenKM}</td>
                        <td>{promotion.LoaiKMText}</td>
                        <td>{promotion.GiaTriKMText}</td>
                        <td>{promotion.NgayBDText}</td>
                        <td>{promotion.NgayKTText}</td>
                        <td>
                          <span className="badge bg-info">
                            {promotion.TrangThaiText}
                          </span>
                        </td>
                        <td className="d-flex justify-content-center gap-3">
                          {/* <Link
                            to={`/admin/vouchers/edit/${promotion._id}`}
                            className="btn btn-warning btn-sm"
                          >
                            <i className="fas fa-edit"></i> Chỉnh Sửa
                          </Link> */}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(promotion._id)}
                          >
                            <i className="fas fa-trash"></i> Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center">
                        Không có dữ liệu.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promotion;
