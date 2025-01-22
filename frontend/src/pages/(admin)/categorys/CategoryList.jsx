import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Để thêm chức năng điều hướng

const CategoryList = () => {
  const API_URL = "http://localhost:5000/api/danhmucs"; // URL API danh mục

  const [categories, setCategories] = useState([]); // State lưu danh sách danh mục

  useEffect(() => {
    (async () => {
      try {
        // Gửi yêu cầu GET để lấy dữ liệu danh mục từ API
        const { data } = await axios.get(API_URL);
        setCategories(data.data); // Lưu dữ liệu vào state
      } catch (error) {
        console.log(error);
        message.error("Lỗi khi tải danh sách danh mục!");
      }
    })();
  }, []); // Chỉ gọi một lần khi component được mount

  // Hàm xử lý xóa danh mục
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này không?")) {
      try {
        await axios.delete(`http://localhost:5000/api/danhmucs/${id}`);
        // Sau khi xóa, cập nhật lại danh sách
        setCategories(categories.filter((category) => category._id !== id));
        message.success("Xóa thành công");
      } catch (error) {
        message.error("Xóa thất bại");
      }
    }
  };

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Danh sách danh mục</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Database danh mục
          </h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            {/* Nút thêm mới */}
            <Link
              to={"/categorys/addcategory"}
              className="btn btn-primary mb-3"
            >
              Thêm mới
            </Link>
            <table className="table table-hover table-bordered dataTable no-footer">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã danh mục</th>
                  <th>Tên danh mục</th>
                  <th>#</th> {/* Cột thao tác (sửa, xóa) */}
                </tr>
              </thead>
              <tbody>
                {categories.map((category, i) => (
                  <tr key={category._id}>
                    <td>{i + 1}</td> {/* Hiển thị STT */}
                    <td>{category._id}</td> {/* Mã danh mục */}
                    <td>{category.TenDM}</td> {/* Tên danh mục */}
                    <td>
                      <Link
                        to={`/categorys/update/${category._id}`} // Dẫn đến trang sửa danh mục
                        className="btn btn-warning ml-2"
                      >
                        Sửa
                      </Link>
                      <button
                        className="btn btn-danger ml-2"
                        onClick={() => handleDelete(category._id)} // Gọi hàm xóa khi bấm nút "Xóa"
                      >
                        Xóa
                      </button>
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

export default CategoryList;
