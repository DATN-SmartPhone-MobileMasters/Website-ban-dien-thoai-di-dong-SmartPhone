import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const [categorys, setCategorys] = useState([]);
  const [loading, setLoading] = useState(true); // Để theo dõi trạng thái loading
  const [error, setError] = useState(null); // Để theo dõi lỗi

  // Lấy dữ liệu từ API
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/danhmucs")
      .then((response) => {
        setCategorys(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Có lỗi khi lấy dữ liệu.");
        setLoading(false);
      });
  }, []);

  // Xử lý xóa danh mục
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      axios
        .delete(`http://localhost:5000/api/danhmucs/${id}`)
        .then((response) => {
          alert("Xóa danh mục thành công!");
          setCategorys((prev) =>
            prev.filter((category) => category._id !== id)
          );
        })
        .catch((error) => {
          alert("Có lỗi xảy ra khi xóa danh mục.");
          console.error(error);
        });
    }
  };

  return (
    <div className="container-fluid">
      {/* Page Heading */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Danh Sách Danh Mục Sản Phẩm</h1>
        <Link className="btn btn-primary" to="/categorys/addCategory">
          Thêm Danh Mục
        </Link>
      </div>
      <p className="mb-4">
        Đây là danh sách tất cả các danh mục sản phẩm trong hệ thống.
      </p>

      {/* Bảng dữ liệu */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Danh Mục Sản Phẩm
          </h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            {/* Hiển thị trạng thái loading */}
            {loading && (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            {/* Hiển thị thông báo lỗi */}
            {error && !loading && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {/* Hiển thị bảng khi dữ liệu có sẵn */}
            {!loading && !error && (
              <table
                className="table table-bordered table-striped"
                id="dataTable"
              >
                <thead>
                  <tr>
                    <th>Mã Danh Mục</th>
                    <th>Tên Danh Mục</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {categorys.length > 0 ? (
                    categorys.map((category) => (
                      <tr key={category._id}>
                        <td>{category.MaDM}</td>
                        <td>{category.TenDM}</td>
                        <td className="d-flex justify-content-center gap-3">
                          <Link
                            to={`/categorys/updatecategory/${category._id}`}
                            className="btn btn-warning btn-sm"
                          >
                            <i className="fas fa-edit"></i> Chỉnh Sửa
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(category._id)}
                          >
                            <i className="fas fa-trash"></i> Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center">
                        Không có dữ liệu.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
