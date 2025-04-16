import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";
import { Table, Button } from "react-bootstrap";
import { deleteBanner, fetchBanners } from "../../../service/api";

const ListBanner = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchBanners();
        console.log("Dữ liệu trả về từ API:", res.data);
        setBanners(res.data || []); // Đảm bảo luôn là mảng
      } catch (error) {
        console.error("Lỗi khi tải danh sách banner:", error);
        message.error("Không thể tải danh sách banner!");
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        const response = await deleteBanner(id);

        if (response && response.status === 200) {
          setBanners(banners.filter((banner) => banner._id !== id));
          message.success("Xóa thành công!");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          message.error(error.response.data.message);
        } else {
          message.error("Xóa thất bại!");
        }
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Danh sách banner</h2>
      <div className="d-flex justify-content-between mb-3">
        <Link to="/admin/banners/add">
          <Button variant="primary" className="btn-lg">
            Thêm mới
          </Button>
        </Link>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Hình ảnh</th>
            <th>Status</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {banners && banners.length > 0 ? (
            banners.map((banner, index) => (
              <tr key={banner._id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={banner.imgUrl || "placeholder.jpg"}
                    alt={banner.imgUrl || "No Image"}
                    width="300px"
                    className="img-thumbnail"
                  />
                </td>
                <td>{banner.status ? "Bật" : "Tắt"}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Link to={`/admin/banners/edit/${banner._id}`}>
                      <Button variant="warning" className="btn-sm">
                        <i className="bi bi-pencil-square"></i> Sửa
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => handleDelete(banner._id)}
                    >
                      <i className="bi bi-trash"></i> Xóa
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Không có dữ liệu để hiển thị.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ListBanner;