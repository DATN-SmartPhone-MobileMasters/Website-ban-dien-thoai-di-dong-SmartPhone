import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { message } from "antd";
import { fetchOrders, deleteOrder } from "../../../service/api";

const OrderList = () => {
  const [hoaDons, setHoaDons] = useState([]);
  const location = useLocation();

  // Hàm định dạng ngày
  const formatDate = (date) => new Date(date).toLocaleDateString();

  useEffect(() => {
    const getHoaDons = async () => {
      try {
        const response = await fetchOrders();
        const orders = response.data.data || [];
        // Sort orders by createdAt in descending order (newest first)
        const sortedOrders = orders.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setHoaDons(sortedOrders);
      } catch (error) {
        console.error("Lỗi khi tải danh sách hóa đơn:", error);
        message.error("Lỗi khi tải danh sách hóa đơn!");
      }
    };
    getHoaDons();
  }, [location.key]);

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      message.success("Xóa hóa đơn thành công");
      const response = await fetchOrders();
      const orders = response.data.data || [];
      // Sort orders again after fetching new data
      const sortedOrders = orders.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setHoaDons(sortedOrders);
    } catch (error) {
      console.error("Lỗi khi xóa hóa đơn:", error);
      message.error("Xóa hóa đơn thất bại!");
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
                    "Ngày tạo",
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
                      <td>
                        {hoaDon.createdAt ? formatDate(hoaDon.createdAt) : "Không có"}
                      </td>
                      <td>{hoaDon.shippingInfo.name || "Không có"}</td>
                      <td>{hoaDon.shippingInfo.phone || "Không có"}</td>
                      <td>{hoaDon.shippingInfo.address || "Không có"}</td>
                      <td>
                        {hoaDon.total ? `${hoaDon.total.toLocaleString()} VND` : "Không có"}
                      </td>
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
                            onClick={() => handleDelete(hoaDon._id)}
                            className="btn btn-danger ml-2"
                          >
                            🗑️Xóa
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