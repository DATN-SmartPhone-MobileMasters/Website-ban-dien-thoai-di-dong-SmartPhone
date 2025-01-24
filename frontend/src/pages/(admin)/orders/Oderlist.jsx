import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Để thêm chức năng điều hướng

const OderList = () => {
  const API_URL = "http://localhost:5000/api/hoadons"; // URL API hóa đơn

  const [hoaDons, setHoaDons] = useState([]); // State lưu danh sách hóa đơn

  useEffect(() => {
    (async () => {
      try {
        // Gửi yêu cầu GET để lấy dữ liệu hóa đơn từ API
        const { data } = await axios.get(API_URL);
        setHoaDons(data.data); // Lưu dữ liệu vào state
      } catch (error) {
        console.log(error);
        message.error("Lỗi khi tải danh sách hóa đơn!");
      }
    })();
  }, []); // Chỉ gọi một lần khi component được mount

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Danh sách hóa đơn</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Database hóa đơn
          </h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            {/* Nút thêm mới */}
            <Link to={"/hoadons/addhoadon"} className="btn btn-primary mb-3">
              Thêm mới
            </Link>
            <table className="table table-hover table-bordered dataTable no-footer">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã hóa đơn</th>
                  <th>Mã người dùng</th>
                  <th>Ngày lập</th>
                  <th>Người nhận</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Phương thức thanh toán</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày nhận hàng</th>
                  <th>#</th> {/* Cột thao tác (sửa, xóa) */}
                </tr>
              </thead>
              <tbody>
                {hoaDons.map((hoaDon, i) => (
                  <tr key={hoaDon._id}>
                    <td>{i + 1}</td> {/* Hiển thị STT */}
                    <td>{hoaDon.MaHD}</td> {/* Mã hóa đơn */}
                    <td>{hoaDon.MaND}</td> {/* Mã người dùng */}
                    <td>
                      {new Date(hoaDon.NgayLap).toLocaleDateString()}
                    </td>{" "}
                    {/* Ngày lập */}
                    <td>{hoaDon.NguoiNhan}</td> {/* Người nhận */}
                    <td>{hoaDon.SDT}</td> {/* Số điện thoại */}
                    <td>{hoaDon.DiaChi}</td> {/* Địa chỉ */}
                    <td>{hoaDon.PhuongThucTT}</td>{" "}
                    {/* Phương thức thanh toán */}
                    <td>{hoaDon.TongTien}</td> {/* Tổng tiền */}
                    <td>{hoaDon.TrangThai}</td> {/* Trạng thái */}
                    <td>
                      {hoaDon.NgayNhanHang
                        ? new Date(hoaDon.NgayNhanHang).toLocaleDateString()
                        : ""}{" "}
                    </td>{" "}
                    {/* Ngày nhận hàng */}
                    <td>
                      <Link
                        to={`/orders/${hoaDon._id}`} // Dẫn đến trang chi tiết hóa đơn
                        className="btn btn-info ml-2"
                      >
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OderList;
