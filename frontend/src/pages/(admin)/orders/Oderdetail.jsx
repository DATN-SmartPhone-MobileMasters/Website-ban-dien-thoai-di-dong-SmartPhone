import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
const OrderDetail = () => {
  const API_URL = "http://localhost:5000/api/hoadons"; // API hóa đơn
  const [hoaDon, setHoaDon] = useState(null); // Lưu thông tin hóa đơn
  const { id } = useParams(); // Lấy ID từ URL
  const [trangThai, setTrangThai] = useState(""); // Lưu trạng thái mới

  // Các trạng thái có thể chọn
  const danhSachTrangThai = ["Chờ xác nhận", "Đang giao", "Đã giao", "Đã hủy"];

  // Lấy thông tin chi tiết hóa đơn
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/${id}`); // Gọi API lấy chi tiết
        setHoaDon(data.data); // Lưu dữ liệu vào state
        setTrangThai(data.data.TrangThai || ""); // Lưu trạng thái hiện tại
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
      }
    })();
  }, [id]);

  // Hàm xử lý khi chọn trạng thái mới
  const handleUpdateTrangThai = async (newTrangThai) => {
    if (newTrangThai === trangThai) return; // Không làm gì nếu chọn lại trạng thái cũ

    // Hiển thị hộp thoại xác nhận
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn cập nhật trạng thái sang "${newTrangThai}"?`
    );

    if (!isConfirmed) return; // Nếu không đồng ý thì thoát

    try {
      await axios.put(`${API_URL}/${id}`, { TrangThai: newTrangThai }); // Gửi API cập nhật
      setTrangThai(newTrangThai); // Cập nhật state
      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  if (!hoaDon) {
    return <p className="text-center">Đang tải dữ liệu...</p>; // Hiển thị khi dữ liệu chưa sẵn sàng
  }

  return (
    <div className="container d-flex justify-content-center">
      <div className="card shadow mb-4 w-75">
        <div className="card-header py-3 text-center">
          <h4 className="m-0 font-weight-bold text-primary">
            Chi tiết hóa đơn
          </h4>
        </div>
        <div className="card-body">
          {/* Bảng hiển thị thông tin hóa đơn */}
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Ngày lập</th>
                <td>{new Date(hoaDon.NgayLap).toLocaleDateString()}</td>
              </tr>
              <tr>
                <th>Người nhận</th>
                <td>{hoaDon.NguoiNhan}</td>
              </tr>
              <tr>
                <th>Số điện thoại</th>
                <td>{hoaDon.SDT}</td>
              </tr>
              <tr>
                <th>Địa chỉ</th>
                <td>{hoaDon.DiaChi}</td>
              </tr>
              <tr>
                <th>Phương thức thanh toán</th>
                <td>{hoaDon.PhuongThucTT}</td>
              </tr>
              <tr>
                <th>Tổng tiền</th>
                <td>{hoaDon.TongTien}</td>
              </tr>
              <tr>
                <th>Ngày nhận hàng</th>
                <td>
                  {hoaDon.NgayNhanHang
                    ? new Date(hoaDon.NgayNhanHang).toLocaleDateString()
                    : "Chưa xác định"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Khung trạng thái đơn hàng */}
          <div className="mt-4 p-3 border rounded bg-light text-center">
            <h5 className="mb-3">Trạng thái đơn hàng</h5>
            <div className="d-flex justify-content-center flex-wrap">
              {danhSachTrangThai.map((status) => (
                <button
                  key={status}
                  className={`btn btn-sm mx-1 my-1 ${
                    trangThai === status ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => handleUpdateTrangThai(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Nút quay lại danh sách */}
          <div className="text-center mt-3">
            <Link to="/orders" className="btn btn-primary">
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
