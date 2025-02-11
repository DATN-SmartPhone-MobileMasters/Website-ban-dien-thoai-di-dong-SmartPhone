import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteCategory, fetchCategories } from "../../../service/api";

const CategoryList = () => {
  const [categorys, setCategorys] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategorys(res.data.data))
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        await deleteCategory(id);
        setCategorys(categorys.filter((category) => category._id !== id));
        alert("Xóa thành công!");
      } catch (error) {
        alert("Xóa thất bại!");
      }
    }
  };

  return (
    <div>
      <h2>Danh sách danh mục</h2>
      <Link to="/categorys/addcategory" className="btn btn-primary">
        Thêm mới
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categorys.map((category, index) => (
            <tr key={category._id}>
              <td>{index + 1}</td>
              <td>{category.TenDM}</td>
              <td>
                <Link
                  to={`/categorys/update/${category._id}`}
                  className="btn btn-warning ml-2"
                >
                  Sửa
                </Link>
                <button
                  className="btn btn-danger ml-2"
                  onClick={() => handleDelete(category._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
