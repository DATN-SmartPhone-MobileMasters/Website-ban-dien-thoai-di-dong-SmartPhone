import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ListOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Trạng thái lỗi

  // Lấy dữ liệu từ API
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/hoadons") // Đảm bảo URL đúng với API của bạn
      .then((response) => {
        setOrders(response.data.data); // Lưu dữ liệu vào state
        setLoading(false);
      })
      .catch((error) => {
        setError("Có lỗi khi lấy dữ liệu.");
        setLoading(false);
      });
  }, []);

  // Xử lý xóa hóa đơn
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hóa đơn này?")) {
      axios
        .delete(`http://localhost:5000/api/hoadons/${id}`)
        .then((response) => {
          alert("Xóa hóa đơn thành công!");
          setOrders(
            (prev) => prev.filter((order) => order._id !== id) // Xóa hóa đơn trong danh sách
          );
        })
        .catch((error) => {
          alert("Có lỗi xảy ra khi xóa hóa đơn.");
          console.error(error);
        });
    }
  };

  return (
    <div className="container-fluid">
      {/* Page Heading */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Danh Sách Hóa Đơn</h1>
        <Link className="btn btn-primary" to="/orders/addOrder">
          Thêm Hóa Đơn
        </Link>
      </div>
      <p className="mb-4">
        Đây là danh sách tất cả các hóa đơn trong hệ thống.
      </p>

      {/* Bảng dữ liệu */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Hóa Đơn</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            {/* Hiển thị trạng thái loading */}
            {loading && (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            {/* Hiển thị thông báo lỗi */}
            {error && !loading && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {/* Hiển thị bảng khi dữ liệu có sẵn */}
            {!loading && !error && (
              <table
                className="table table-bordered table-striped"
                id="dataTable"
              >
                <thead>
                  <tr>
                    <th>Mã Hóa Đơn</th>
                    <th>Tên Người Dùng</th>
                    <th>Ngày Lập</th>
                    <th>Người Nhận</th>
                    <th>Điện Thoại</th>
                    <th>Địa Chỉ</th>
                    <th>Phương Thức Thanh Toán</th>
                    <th>Tổng Tiền</th>
                    <th>Trạng Thái</th>
                    <th>Ngày Nhận Hàng</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order.maHD}</td>
                        <td>{order.maND}</td>
                        <td>{order.NgayLap}</td>
                        <td>{order.NguoiNhan}</td>
                        <td>{order.SDT}</td>
                        <td>{order.DiaChi}</td>
                        <td>{order.PhieuThucTT}</td>
                        <td>{order.TongTien}</td>
                        <td>{order.TrangThai}</td>
                        <td>{order.NgayNhanHang}</td>
                        <td className="d-flex justify-content-center gap-3">
                          <Link
                            to={`/orders/updateStatus/${order._id}`}
                            className="btn btn-warning btn-sm"
                          >
                            <i className="fas fa-edit"></i> Chi Tiết
                          </Link>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(order._id)}
                          >
                            <i className="fas fa-trash"></i> Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="text-center">
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

export default ListOrder;
