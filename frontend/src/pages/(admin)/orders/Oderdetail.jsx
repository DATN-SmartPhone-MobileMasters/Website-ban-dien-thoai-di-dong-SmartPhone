import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const OderDetail = () => {
  const API_URL = "http://localhost:5000/api/hoadons";
  const [hoaDon, setHoaDon] = useState(null);
  const { id } = useParams();
  const [trangThai, setTrangThai] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/${id}`);
        setHoaDon(data.data);
        setTrangThai(data.data.TrangThai || "");
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
      }
    })();
  }, [id]);

  const handleChangeTrangThai = async (newTrangThai) => {
    if (window.confirm("Bạn có chắc chắn muốn thay đổi trạng thái?")) {
      setTrangThai(newTrangThai);
      try {
        await axios.put(`${API_URL}/${id}`, { TrangThai: newTrangThai });
        alert("Cập nhật trạng thái thành công!");
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        alert("Có lỗi xảy ra khi cập nhật trạng thái!");
      }
    }
  };

  if (!hoaDon) {
    return <p>Đang tải dữ liệu...</p>;
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

          <div
            className="card mt-4 p-3 shadow-sm"
            style={{ borderRadius: "10px", backgroundColor: "#f9f9f9" }}
          >
            <h5 className="text-center mb-3">Chọn trạng thái đơn hàng</h5>
            <div className="btn-group d-flex justify-content-center w-100">
              <button
                className="btn btn-warning mx-2 rounded-pill shadow"
                onClick={() => handleChangeTrangThai("Đang giao")}
              >
                Đang giao
              </button>
              <button
                className="btn btn-success mx-2 rounded-pill shadow"
                onClick={() => handleChangeTrangThai("Đã giao")}
              >
                Đã giao
              </button>
              <button
                className="btn btn-danger mx-2 rounded-pill shadow"
                onClick={() => handleChangeTrangThai("Đã hủy")}
              >
                Đã hủy
              </button>
              <button
                className="btn btn-info mx-2 rounded-pill shadow"
                onClick={() => handleChangeTrangThai("Chờ xác nhận")}
              >
                Chờ xác nhận
              </button>
            </div>
          </div>

          <Link to="/orders" className="btn btn-primary mt-3">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OderDetail;
