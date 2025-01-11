import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateOrderStatus = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy thông tin đơn hàng theo ID
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/hoadons/${id}`)
      .then((response) => {
        setOrder(response.data.data);
        setStatus(response.data.data.TrangThai); // Set trạng thái hiện tại
        setLoading(false);
      })
      .catch((error) => {
        setError("Không thể tải thông tin đơn hàng.");
        setLoading(false);
      });
  }, [id]);

  // Cập nhật trạng thái đơn hàng
  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/hoadons/${id}`, { TrangThai: status })
      .then(() => {
        alert("Cập nhật trạng thái thành công!");
        navigate("/listorder"); // Quay về danh sách đơn hàng
      })
      .catch((error) => {
        alert("Có lỗi xảy ra khi cập nhật trạng thái.");
        console.error(error);
      });
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h1 className="mb-4">Cập Nhật Trạng Thái Đơn Hàng</h1>
      {/* Hiển thị thông tin chi tiết đơn hàng */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Chi Tiết Đơn Hàng</h5>
        </div>
        <div className="card-body">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Mã Hóa Đơn</th>
                <td>{order.maHD}</td>
              </tr>
              <tr>
                <th>Tên Người Dùng</th>
                <td>{order.maND}</td>
              </tr>
              <tr>
                <th>Ngày Lập</th>
                <td>{order.NgayLap}</td>
              </tr>
              <tr>
                <th>Người Nhận</th>
                <td>{order.NguoiNhan}</td>
              </tr>
              <tr>
                <th>Điện Thoại</th>
                <td>{order.SDT}</td>
              </tr>
              <tr>
                <th>Địa Chỉ</th>
                <td>{order.DiaChi}</td>
              </tr>
              <tr>
                <th>Phương Thức Thanh Toán</th>
                <td>{order.PhieuThucTT}</td>
              </tr>
              <tr>
                <th>Tổng Tiền</th>
                <td>{order.TongTien}</td>
              </tr>
              <tr>
                <th>Trạng Thái</th>
                <td>{order.TrangThai}</td>
              </tr>
              <tr>
                <th>Ngày Nhận Hàng</th>
                <td>{order.NgayNhanHang}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Form cập nhật trạng thái */}
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label className="form-label">Trạng Thái Đơn Hàng</label>
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Chờ xử lý">Chờ xử lý</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Đã hoàn thành">Đã hoàn thành</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Cập Nhật
        </button>
      </form>
    </div>
  );
};

export default UpdateOrderStatus;
