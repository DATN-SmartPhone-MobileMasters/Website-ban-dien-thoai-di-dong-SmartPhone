import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api"; // Đổi URL API nếu cần

const OderDetail = () => {
  const [hoaDon, setHoaDon] = useState(null);
  const [chiTietHoaDons, setChiTietHoaDons] = useState([]);
  const { id } = useParams();
  const [trangThai, setTrangThai] = useState("");
  const navigate = useNavigate(); // ✅ Thêm useNavigate

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/hoadons/${id}`);
        setHoaDon(data.data);
        setTrangThai(data.data.TrangThai || "");

        const chiTietRes = await axios.get(`${API_URL}/chitiethoadons/${id}`);
        setChiTietHoaDons(chiTietRes.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
      }
    })();
  }, [id]);

  const handleChangeTrangThai = async (newTrangThai) => {
    if (window.confirm("Bạn có chắc chắn muốn thay đổi trạng thái?")) {
      try {
        await axios.put(`${API_URL}/hoadons/${id}`, {
          TrangThai: newTrangThai,
        });

        alert("Cập nhật trạng thái thành công!");

        // ✅ Tự động chuyển về danh sách hóa đơn sau khi cập nhật
        navigate("/orders");
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
                <th>Người nhận</th>
                <td>{hoaDon.NguoiDat}</td>
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
                <th>Tổng tiền</th>
                <td>{hoaDon.TongTien}</td>
              </tr>
              <tr>
                <th>Trạng thái</th>
                <td>{hoaDon.TrangThai} 🚚</td>
              </tr>
            </tbody>
          </table>

          <h5 className="mt-4">Danh sách sản phẩm</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Mã chi tiết hóa đơn</th>
                <th>Mã sản phẩm</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {chiTietHoaDons.map((item) => (
                <tr key={item.MaCTHD}>
                  <td>{item.MaCTHD}</td>
                  <td>{item.MaSP}</td>
                  <td>{item.SoLuong}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 p-3 bg-light rounded shadow-sm">
            <h5 className="text-center mb-3">Trạng thái đơn hàng</h5>
            <div
              className="d-flex flex-wrap justify-content-center gap-3"
              style={{ gap: "10px" }}
            >
              <button
                className="btn btn-warning px-4 py-2 rounded-pill shadow"
                onClick={() => handleChangeTrangThai("Đang giao")}
              >
                🚚 Đang giao
              </button>
              <button
                className="btn btn-success px-4 py-2 rounded-pill shadow"
                onClick={() => handleChangeTrangThai("Đã giao")}
              >
                ✅ Đã giao
              </button>
              <button
                className="btn btn-danger px-4 py-2 rounded-pill shadow"
                onClick={() => handleChangeTrangThai("Đã hủy")}
              >
                ❌ Đã hủy
              </button>
              <button
                className="btn btn-info px-4 py-2 rounded-pill shadow"
                onClick={() => handleChangeTrangThai("Chờ xác nhận")}
              >
                ⏳ Chờ xác nhận
              </button>
            </div>
          </div>

          <Link
            to="/orders"
            className="btn btn-primary mt-3 px-4 py-2 rounded-pill shadow"
          >
            🔙 Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OderDetail;
