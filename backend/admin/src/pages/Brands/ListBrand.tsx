import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ListBrand = () => {
  const API_URL = "/api/thuonghieus";
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(API_URL);
        setBrands(res.data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setBrands(brands.filter((item) => item._id !== id));
        message.success("Xóa thành công");
      } catch (err) {
        message.error("Xóa thất bại");
      }
    }
  };
  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Tables</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            {" "}
            Database thuonghieu
          </h6>
        </div>
        <div className="card-body">
          <Link to="/brands/add" className="btn btn-primary mb-3">
            Thêm thương hiệu
          </Link>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên thương hiệu</th>
                  <th>Hình ảnh</th>
                  <th>Mô tả</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand, i) => (
                  <tr key={i}>
                    <td>{brand.MaTH}</td>
                    <td>{brand.TenTH}</td>
                    <td>
                      <img
                        style={{ width: 200 }}
                        src={`./src/./img/${brand.HinhAnh}`}
                        alt="samsung.png"
                      />
                    </td>
                    <td>{brand.Mota}</td>
                    <td>
                      <button className="btn btn-info">Xem</button>
                      <button className="btn btn-warning ml-2">Sửa</button>
                      <button
                        onClick={() => handleDelete(brand._id)}
                        className="btn btn-danger ml-2"
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

export default ListBrand;
