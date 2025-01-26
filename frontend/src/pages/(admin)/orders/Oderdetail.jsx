import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const OderDetail = () => {
  const API_URL = "http://localhost:5000/api/hoadons"; // API cho hóa đơn
  const [hoaDon, setHoaDon] = useState(null); // Lưu thông tin hóa đơn
  const { id } = useParams(); // Lấy ID từ URL
  const [trangThai, setTrangThai] = useState(""); // Lưu trạng thái mới

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

  // Hàm xử lý khi thay đổi trạng thái
  const handleChangeTrangThai = async (e) => {
    const newTrangThai = e.target.value; // Lấy giá trị mới từ select
    setTrangThai(newTrangThai); // Cập nhật state tạm thời

    try {
      // Gọi API để cập nhật trạng thái
      await axios.put(`${API_URL}/${id}`, { TrangThai: newTrangThai });
      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái!");
    }
  };

  if (!hoaDon) {
    return <p>Đang tải dữ liệu...</p>; // Hiển thị khi dữ liệu chưa sẵn sàng
  }

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Chi tiết hóa đơn</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Thông tin hóa đơn
          </h6>
        </div>
        <div className="card-body">
          <p>
            <strong>Mã hóa đơn:</strong> {hoaDon.maHD}
          </p>
          <p>
            <strong>Mã người dùng:</strong> {hoaDon.maND}
          </p>
          <p>
            <strong>Ngày lập:</strong>{" "}
            {new Date(hoaDon.NgayLap).toLocaleDateString()}
          </p>
          <p>
            <strong>Người nhận:</strong> {hoaDon.NguoiNhan}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {hoaDon.SDT}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {hoaDon.DiaChi}
          </p>
          <p>
            <strong>Phương thức thanh toán:</strong> {hoaDon.PhieuThucTT}
          </p>
          <p>
            <strong>Tổng tiền:</strong> {hoaDon.TongTien}
          </p>
          <p>
            <strong>Trạng thái:</strong>
            <select
              value={trangThai}
              onChange={handleChangeTrangThai}
              className="form-control d-inline-block w-auto ml-2"
            >
              {/* Các trạng thái có thể chọn */}
              <option value="Đang giao">Đang giao</option>
              <option value="Đã giao">Đã giao</option>
              <option value="Đã hủy">Đã hủy</option>
              <option value="Chờ xác nhận">Chờ xác nhận</option>
            </select>
          </p>
          <p>
            <strong>Ngày nhận hàng:</strong>{" "}
            {hoaDon.NgayNhanHang
              ? new Date(hoaDon.NgayNhanHang).toLocaleDateString()
              : "Chưa xác định"}
          </p>

          <Link to="/hoadons" className="btn btn-primary mt-3">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OderDetail;
