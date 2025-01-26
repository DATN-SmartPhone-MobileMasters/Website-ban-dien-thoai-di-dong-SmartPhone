import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OderList = () => {
  const API_URL = "http://localhost:5000/api/hoadons";
  const [hoaDons, setHoaDons] = useState([]);

  // Hàm tải danh sách hóa đơn
  const fetchHoaDons = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setHoaDons(data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Lỗi khi tải danh sách hóa đơn!");
    }
  };

  useEffect(() => {
    fetchHoaDons();
  }, []);

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
            {/* Bảng dữ liệu */}
            <table className="table table-hover table-bordered dataTable no-footer">
              <thead>
                <tr>
                  {[
                    "STT",
                    "Mã hóa đơn",
                    "Mã người dùng",
                    "Ngày lập",
                    "Người nhận",
                    "Số điện thoại",
                    "Địa chỉ",
                    "Phương thức thanh toán",
                    "Tổng tiền",
                    "Trạng thái",
                    "Ngày nhận hàng",
                    "#",
                  ].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hoaDons.length > 0 ? (
                  hoaDons.map((hoaDon, i) => (
                    <tr key={hoaDon._id}>
                      <td>{i + 1}</td>
                      <td>{hoaDon.maHD || "Không có"}</td>
                      <td>{hoaDon.maND || "Không có"}</td>
                      <td>
                        {hoaDon.NgayLap
                          ? new Date(hoaDon.NgayLap).toLocaleDateString()
                          : "Không có"}
                      </td>
                      <td>{hoaDon.NguoiNhan || "Không có"}</td>
                      <td>{hoaDon.SDT || "Không có"}</td>
                      <td>{hoaDon.DiaChi || "Không có"}</td>
                      <td>{hoaDon.PhieuThucTT || "Không có"}</td>
                      <td>{hoaDon.TongTien || "Không có"}</td>
                      <td>{hoaDon.TrangThai || "Không có"}</td>
                      <td>
                        {hoaDon.NgayNhanHang
                          ? new Date(hoaDon.NgayNhanHang).toLocaleDateString()
                          : "Chưa nhận"}
                      </td>
                      <td>
                        <Link
                          to={`/orders/${hoaDon._id}`}
                          className="btn btn-info ml-2"
                        >
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center">
                      Không có dữ liệu hóa đơn.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OderList;
