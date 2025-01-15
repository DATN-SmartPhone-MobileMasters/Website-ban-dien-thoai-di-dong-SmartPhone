import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const Promotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/promotion")
      .then((response) => {
        setPromotions(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Có lỗi khi lấy dữ liệu.");
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    confirmAlert({
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa khuyến mãi này?",
      buttons: [
        {
          label: "Có",
          onClick: () => {
            axios
              .delete(`http://localhost:5000/api/v1/promotion/${id}`)
              .then((response) => {
                setPromotions((prev) =>
                  prev.filter((promotion) => promotion._id !== id)
                );
                confirmAlert({
                  title: "Xóa thành công",
                  message: "Khuyến mãi đã được xóa thành công!",
                  buttons: [
                    {
                      label: "OK",
                      onClick: () => {},
                    },
                  ],
                  closeOnEscape: true,
                  closeOnClickOutside: true,
                });
              })
              .catch((error) => {
                alert("Có lỗi xảy ra khi xóa khuyến mãi.");
                console.error(error);
              });
          },
        },
        {
          label: "Không",
          onClick: () => {},
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
    });
  };
  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return "Đang diễn ra";
      case 1:
        return "Kết thúc";
      case 2:
        return "Chưa bắt đầu";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Danh Sách Khuyến Mãi</h1>
        <Link className="btn btn-primary" to="/add/promotion">
          Thêm Khuyến Mãi
        </Link>
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
              <table
                className="table table-bordered table-striped"
                id="dataTable"
              >
                <thead>
                  <tr>
                    <th>Mã Khuyến Mãi</th>
                    <th>Tên Khuyến Mãi</th>
                    <th>Loại Khuyến Mãi</th>
                    <th>Giá Trị Khuyến Mãi</th>
                    <th>Ngày Bắt Đầu</th>
                    <th>Ngày Kết Thúc</th>
                    <th>Trạng Thái</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions && promotions.length > 0 ? (
                    promotions.map((promotion) => (
                      <tr key={promotion._id}>
                        <td>{promotion.MaKM}</td>
                        <td>{promotion.TenKM}</td>
                        <td>{promotion.LoaiKM}</td>
                        <td>{promotion.GiaTriKM}</td>
                        <td>
                          {new Date(promotion.NgayBD).toLocaleDateString()}
                        </td>
                        <td>
                          {new Date(promotion.NgayKT).toLocaleDateString()}
                        </td>
                        <td>{getStatusLabel(promotion.TrangThai)}</td>
                        <td className="d-flex justify-content-center gap-3">
                          <Link
                            to={`/edit/promotion/${promotion._id}`}
                            className="btn btn-warning btn-sm"
                          >
                            <i className="fas fa-edit"></i> Chỉnh Sửa
                          </Link>
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
