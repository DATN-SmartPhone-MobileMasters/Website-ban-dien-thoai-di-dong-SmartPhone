import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductsList = () => {

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/sanphams`);

      if (res.data) {
        setProducts(res.data);
      } else {
        console.log("Dữ liệu không phải là mảng, cấu trúc dữ liệu:", res.data);
        setProducts([]);
      }
    } catch (err) {
      setError(err);
      console.log("Lỗi hiển thị dữ liệu sản phẩm", err);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);


  const removeItem = async (id) => {
    try {
      if (window.confirm("Bạn có muốn xóa sản phẩm không?")) {
        await axios.delete(`http://localhost:5000/api/sanphams/${id}`);

        setProducts(products.filter((item) => item._id !== id));
        alert("Sản phẩm đã được xóa thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Có lỗi xảy ra khi xóa sản phẩm!");
    }
  };

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Có lỗi xảy ra: {error.message}</p>;

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">STT</th>
            <th scope="col">MaSP</th>
            <th scope="col">MaKM</th>
            <th scope="col">TenSP</th>
            <th scope="col">GiaSP</th>
            <th scope="col">SoLuong</th>
            <th scope="col">HinhAnh1</th>
            <th scope="col">HinhAnh2</th>
            <th scope="col">HinhAnh3</th>
            <th scope="col">created_at</th>
            <th scope="col">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => (
            <tr key={item._id}>
              <th scope="row">{index + 1}</th>
              <td>{item._id}</td>
              <td>{item.MaKM || "Không có mã KM"}</td>
              <td>{item.TenSP}</td>
              <td>{item.GiaSP}</td>
              <td>{item.SoLuong}</td>
              <td>{item.HinhAnh1}</td>
              <td>{item.HinhAnh2}</td>
              <td>{item.HinhAnh3}</td>
              <td>{new Date(item.created_at).toLocaleDateString()}</td> {/* Hiển thị ngày đẹp hơn */}
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => removeItem(item._id)}
                >
                  Xóa

                </button>{" "}
                <Link to={`/products/edit/${item._id}`}>
                  <button className="btn btn-primary">Sửa</button>
                </Link>{" "}

                </button> <span> </span>
                <Link to={`/products/edit/${item._id}`}>
                  <button className="btn btn-primary">Sửa</button>
                </Link> <span> </span>

                <Link to={`/products/detail/${item._id}`}>
                  <button className="btn btn-primary">Chi tiết</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default ProductsList;
