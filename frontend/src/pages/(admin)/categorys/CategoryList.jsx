import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteCategory, fetchCategories } from "../../../service/api";
import { Table, Button } from "react-bootstrap";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data.data))
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter((category) => category._id !== id));
        alert("Xóa thành công!");
      } catch (error) {
        alert("Xóa thất bại!");
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Danh sách danh mục</h2>
      <Link to="/categorys/addcategory">
        <Button variant="primary" className="mb-3">
          Thêm mới
        </Button>
      </Link>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((category, index) => (
            <tr key={category._id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{category.TenDM}</td>
              <td>
                <Link to={`/categorys/update/${category._id}`}>
                  <Button variant="warning" className="me-2">
                    Sửa
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(category._id)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-end mt-3">
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Trước
        </Button>
        <span className="mx-3 align-self-center">
          Trang {currentPage} / {totalPages}
        </span>
        <Button
          variant="secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Tiếp
        </Button>
      </div>
    </div>
  );
};

export default CategoryList;
