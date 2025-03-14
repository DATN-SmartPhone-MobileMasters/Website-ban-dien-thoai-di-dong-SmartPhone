import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { message } from "antd";
import { fetchOrders } from "../../../service/api";

const OrderList = () => {
  const [hoaDons, setHoaDons] = useState([]);
  const location = useLocation();
  useEffect(() => {
    const getHoaDons = async () => {
      try {
        const response = await fetchOrders();
        setHoaDons(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách hóa đơn:", error);
        message.error("Lỗi khi tải danh sách hóa đơn!");
      }
    };
    getHoaDons();
  }, [location.key]);

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
            <table className="table table-hover table-bordered dataTable no-footer">
              <thead>
                <tr>
                  {[
                    "STT",
                    "Người nhận",
                    "Số điện thoại",
                    "Địa chỉ",
                    "Tổng tiền",
                    "Trạng thái",
                    "Hành động",
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
                      <td>{hoaDon.shippingInfo.name || "Không có"}</td>
                      <td>{hoaDon.shippingInfo.phone|| "Không có"}</td>
                      <td>{hoaDon.shippingInfo.address||"Không có"}</td>
                      <td>{hoaDon.total || "Không có"}</td>
                      <td>{hoaDon.paymentStatus || "Không có"}</td>
                      <td>
                        <Link
                          to={`/admin/orders/${hoaDon._id}`}
                          className="btn btn-info ml-2"
                        >
                          👁️Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
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

export default OrderList;
