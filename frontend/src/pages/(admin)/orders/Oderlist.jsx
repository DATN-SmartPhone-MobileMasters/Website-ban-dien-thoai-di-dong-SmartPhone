import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { message } from "antd";
import { fetchOrders  } from "../../../service/api";

const OrderList = () => {
  const [hoaDons, setHoaDons] = useState([]);
  const [hiddenOrders, setHiddenOrders] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const getHoaDons = async () => {
      try {
        const response = await fetchOrders();
        // Get hidden order IDs from localStorage
        const storedHiddenOrders = JSON.parse(localStorage.getItem('hiddenOrders')) || [];
        setHiddenOrders(storedHiddenOrders);
        
        // Filter out hidden orders
        const visibleOrders = response.data.data.filter(
          (order) => !storedHiddenOrders.includes(order._id)
        );
        setHoaDons(visibleOrders || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách hóa đơn:", error);
        message.error("Lỗi khi tải danh sách hóa đơn!");
      }
    };
    getHoaDons();
  }, [location.key]);

  const handleHideOrder = async (id) => {
    try {
      // Add to hidden orders list
      const updatedHiddenOrders = [...hiddenOrders, id];
      setHiddenOrders(updatedHiddenOrders);
      localStorage.setItem('hiddenOrders', JSON.stringify(updatedHiddenOrders));
      
      // Update the displayed list
      setHoaDons(hoaDons.filter(order => order._id !== id));
      
      message.success("Đã ẩn đơn hàng thành công");
    } catch (error) {
      console.error("Lỗi khi ẩn đơn hàng:", error);
      message.error("Ẩn đơn hàng thất bại!");
    }
  };

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
                      <td>{hoaDon.shippingInfo.phone || "Không có"}</td>
                      <td>{hoaDon.shippingInfo.address || "Không có"}</td>
                      <td>{hoaDon.total || "Không có"}</td>
                      <td>{hoaDon.paymentStatus || "Không có"}</td>
                      <td>
                        <Link
                          to={`/admin/orders/${hoaDon._id}`}
                          className="btn btn-info ml-2"
                        >
                          👁️Xem chi tiết
                        </Link>
                        {(hoaDon.paymentStatus === "Huỷ Đơn" || 
                          hoaDon.paymentStatus === "Hoàn thành") && (
                          <button
                            onClick={() => handleHideOrder(hoaDon._id)}
                            className="btn btn-warning ml-2"
                          >
                            🚫Ẩn đơn hàng
                          </button>
                        )}
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