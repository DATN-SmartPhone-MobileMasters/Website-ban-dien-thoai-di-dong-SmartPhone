import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dữ liệu sản phẩm
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/sanphams`);
      if (res.data) {
        setProducts(res.data);
      } else {
        console.log("Không có dữ liệu sản phẩm");
      }
    } catch (err) {
      setError(err);
      console.log("Lỗi hiển thị dữ liệu sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Xóa sản phẩm
  const removeItem = async (id) => {
    try {
      if (window.confirm("Bạn có muốn xóa sản phẩm không?")) {
        await axios.delete(`http://localhost:5000/api/sanphams/${id}`);
        // Cập nhật danh sách sản phẩm
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
            <th scope="col">MaTH</th>
            <th scope="col">MaDM</th>
            <th scope="col">MaKM</th>
            <th scope="col">TenSP</th>
            <th scope="col">GiaSP</th>
            <th scope="col">SoLuong</th>
            <th scope="col">HinhAnh1</th>
            <th scope="col">BoNhoTrong</th>
            <th scope="col">Mau</th>
            <th scope="col">ManHinh</th>
            <th scope="col">MoTa</th>
            <th scope="col">created_at</th>
            <th scope="col">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => (
            <tr key={item._id}>
              <th scope="row">{index + 1}</th>
           
              <td>{item.MaSP}</td>
              <td>{item.MaTH}</td>
              <td>{item.MaDM}</td>
              <td>{item.MaKM}</td>
              <td>{item.TenSP}</td>
              <td>{item.GiaSP}</td>
              <td>{item.SoLuong}</td>
              <td>{item.HinhAnh1}</td>
              <td>{item.BoNhoTrong}</td>
              <td>{item.Mau}</td>
              <td>{item.ManHinh}</td>
              <td>{item.MoTa}</td>
              <td>{item.created_at}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => removeItem(item._id)}
                >
                  Xóa
                </button> <span> </span>
                <Link to={`/ProductsEdit/${item._id}`}>
                  <button className="btn btn-primary">Sửa</button>
                </Link> <span> </span>
                <Link to={`/ProductsDetail/${item._id}`}>
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
