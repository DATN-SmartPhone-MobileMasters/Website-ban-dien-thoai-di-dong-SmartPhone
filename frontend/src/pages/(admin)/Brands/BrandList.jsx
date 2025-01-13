import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BrandList = () => {
  const API_URL = "/api/thuonghieus";

  const [brands, setBrands] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(API_URL);
        setBrands(data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thương hiệu này không?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setBrands(brands.filter((item) => item._id !== id));
        message.success("Xóa thành công");
      } catch (error) {
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
            Database thuonghieu
          </h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <Link to={"/brands/add"} className="btn btn-primary">
              Thêm mới
            </Link>
            <table className="table table-hover table-bordered dataTable no-footer">
              <thead>
                <tr>
                  <th>Mã thương hiệu</th>
                  <th>Tên thương hiệu</th>
                  <th>Hình ảnh</th>
                  <th>Mô tả</th>
                  <th>#</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand, i) => (
                  <tr key={i}>
                    <td>{brand.MaTH}</td>
                    <td>{brand.TenTH}</td>
                    <td>
                      <img
                        src={`./src/./img/${brand.HinhAnh}`}
                        width={200}
                        height={100}
                        alt={`${brand.HinhAnh}`}
                      />
                    </td>
                    <td>{brand.Mota}</td>
                    <td>
                      <Link to={`/brands/detail/${brand._id}`} className="btn btn-info">
                        Xem
                      </Link>
                      <Link to={`/brands/edit/${brand._id}`} className="btn btn-warning ml-2">
                        Sửa
                      </Link>
                      <button
                        className="btn btn-danger ml-2"
                        onClick={() => handleDelete(brand._id)}
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

export default BrandList;