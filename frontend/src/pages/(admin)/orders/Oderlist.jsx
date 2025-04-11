import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { message } from "antd";
import { fetchOrders, deleteOrder } from "../../../service/api";

const OrderList = () => {
  const [hoaDons, setHoaDons] = useState([]);
  const [filteredHoaDons, setFilteredHoaDons] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortTotal, setSortTotal] = useState(""); // Bộ lọc sắp xếp tổng tiền
  const location = useLocation();

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
        setFilteredHoaDons(sortedOrders); // Ban đầu hiển thị tất cả
      } catch (error) {
        console.error("Lỗi khi tải danh sách hóa đơn:", error);
        message.error("Lỗi khi tải danh sách hóa đơn!");
      }
    };
    getHoaDons();
  }, [location.key]);

  // Xử lý lọc và sắp xếp khi các bộ lọc thay đổi
  useEffect(() => {
    let filtered = [...hoaDons];

    // Lọc theo trạng thái
    if (statusFilter) {
      filtered = filtered.filter(
        (hoaDon) => hoaDon.paymentStatus === statusFilter
      );
    }

    // Lọc theo ngày
    if (dateFilter) {
      filtered = filtered.filter((hoaDon) => {
        const createdAt = new Date(hoaDon.createdAt).toLocaleDateString("en-CA");
        return createdAt === dateFilter;
      });
    }

    // Sắp xếp theo tổng tiền
    if (sortTotal === "high-to-low") {
      filtered = filtered.sort((a, b) => (b.total || 0) - (a.total || 0));
    } else if (sortTotal === "low-to-high") {
      filtered = filtered.sort((a, b) => (a.total || 0) - (b.total || 0));
    }

    setFilteredHoaDons(filtered);
  }, [statusFilter, dateFilter, sortTotal, hoaDons]);

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
      setFilteredHoaDons(sortedOrders);
    } catch (error) {
      console.error("Lỗi khi xóa hóa đơn:", error);
      message.error("Xóa hóa đơn thất bại!");
    }
  };

  // Hàm định dạng ngày
  const formatDate = (date) => new Date(date).toLocaleDateString();

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
          {/* Bộ lọc */}
          <div className="mb-3 d-flex justify-content-between flex-wrap">
            <div className="mb-2">
              <label htmlFor="statusFilter" className="mr-2">
                Lọc theo trạng thái:
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-control d-inline-block"
                style={{ width: "200px" }}
              >
                <option value="">Tất cả</option>
                <option value="Chờ xử lý">Chờ xử lý</option>
                <option value="Huỷ Đơn">Huỷ Đơn</option>
                <option value="Đang Giao">Đang Giao</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="dateFilter" className="mr-2">
                Tìm theo ngày:
              </label>
              <input
                type="date"
                id="dateFilter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="form-control d-inline-block"
                style={{ width: "200px" }}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="sortTotal" className="mr-2">
                Sắp xếp tổng tiền:
              </label>
              <select
                id="sortTotal"
                value={sortTotal}
                onChange={(e) => setSortTotal(e.target.value)}
                className="form-control d-inline-block"
                style={{ width: "200px" }}
              >
                <option value="">Mặc định</option>
                <option value="high-to-low">Cao đến thấp</option>
                <option value="low-to-high">Thấp đến cao</option>
              </select>
            </div>
          </div>
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
                {filteredHoaDons.length > 0 ? (
                  filteredHoaDons.map((hoaDon, i) => (
                    <tr key={hoaDon._id}>
                      <td>{i + 1}</td>
                      <td>
                        {hoaDon.createdAt ? formatDate(hoaDon.createdAt) : "Không có"}
                      </td>
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