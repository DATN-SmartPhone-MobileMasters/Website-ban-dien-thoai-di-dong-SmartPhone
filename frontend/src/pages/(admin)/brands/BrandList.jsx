import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";
import { deleteBrand, fetchBrands } from "../../../service/api";

const BrandList = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchBrands()
      .then((res) => setBrands(res.data.data))
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        await deleteBrand(id);
        setBrands(brands.filter((brand) => brand._id !== id));
        message.success("Xóa thành công!");
      } catch (error) {
        message.error("Xóa thất bại!");
      }
    }
  };

  return (
    <div>
      <h2>Danh sách thương hiệu</h2>
      <Link to="/admin/brands/add" className="btn btn-primary">Thêm mới</Link>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên thương hiệu</th>
            <th>Danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand, index) => (
            <tr key={brand._id}>
              <td>{index + 1}</td>
              <td>{brand.TenTH}</td>
              <td>
                {brand.MaDM && brand.MaDM.length > 0
                  ? brand.MaDM.map(dm => dm.TenDM).join(", ")
                  : "Chưa có danh mục"}
              </td>
              <td>
                <Link to={`/admin/brands/detail/${brand._id}`} className="btn btn-info">Xem</Link>
                <Link to={`/admin/brands/edit/${brand._id}`} className="btn btn-warning ml-2">Sửa</Link>
                <button className="btn btn-danger ml-2" onClick={() => handleDelete(brand._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrandList;
