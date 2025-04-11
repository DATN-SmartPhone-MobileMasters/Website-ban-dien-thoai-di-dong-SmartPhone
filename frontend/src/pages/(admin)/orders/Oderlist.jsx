import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { message } from "antd";
import { fetchOrders } from "../../../service/api";

const OrderList = () => {
  const [hoaDons, setHoaDons] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [hiddenOrders, setHiddenOrders] = useState([]);
  const [showHidden, setShowHidden] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const getHoaDons = async () => {
      try {
        const response = await fetchOrders();
        const storedHiddenOrders = JSON.parse(localStorage.getItem("hiddenOrders")) || [];
        setHiddenOrders(storedHiddenOrders);
        const all = response.data.data || [];
        setAllOrders(all);

        // Lọc theo trạng thái hiển thị
        const filtered = showHidden
          ? all.filter((order) => storedHiddenOrders.includes(order._id))
          : all.filter((order) => !storedHiddenOrders.includes(order._id));
        setHoaDons(filtered);
      } catch (error) {
        console.error("Lỗi khi tải danh sách hóa đơn:", error);
        message.error("Lỗi khi tải danh sách hóa đơn!");
      }
    };

    getHoaDons();
  }, [location.key, showHidden]);

  const handleHideOrder = (id) => {
    const updatedHiddenOrders = [...hiddenOrders, id];
    setHiddenOrders(updatedHiddenOrders);
    localStorage.setItem("hiddenOrders", JSON.stringify(updatedHiddenOrders));

    // Cập nhật danh sách đơn hiển thị
    setHoaDons(hoaDons.filter((order) => order._id !== id));
    message.success("Đã ẩn đơn hàng thành công");
  };

  const handleRestoreOrder = (id) => {
    const updatedHiddenOrders = hiddenOrders.filter((item) => item !== id);
    setHiddenOrders(updatedHiddenOrders);
    localStorage.setItem("hiddenOrders", JSON.stringify(updatedHiddenOrders));

    // Cập nhật lại danh sách đơn hiển thị
    setHoaDons(allOrders.filter((order) =>
      showHidden
        ? updatedHiddenOrders.includes(order._id)
        : !updatedHiddenOrders.includes(order._id)
    ));
    message.success("Đã khôi phục đơn hàng");
  };

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Danh sách hóa đơn</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h6 className="m-0 font-weight-bold text-primary">Database hóa đơn</h6>
          <button
            className="btn btn-secondary"
            onClick={() => setShowHidden(!showHidden)}
          >
            {showHidden ? "🔙 Quay lại danh sách chính" : "👻 Xem đơn hàng đã ẩn"}
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-bordered dataTable no-footer">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Người nhận</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
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
                          👁️ Xem chi tiết
                        </Link>
                        {!showHidden && (
                          (hoaDon.paymentStatus === "Huỷ Đơn" ||
                            hoaDon.paymentStatus === "Hoàn thành") && (
                            <button
                              onClick={() => handleHideOrder(hoaDon._id)}
                              className="btn btn-warning ml-2"
                            >
                              🚫 Ẩn đơn hàng
                            </button>
                          )
                        )}
                        {showHidden && (
                          <button
                            onClick={() => handleRestoreOrder(hoaDon._id)}
                            className="btn btn-success ml-2"
                          >
                            ♻️ Khôi phục
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
