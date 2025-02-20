import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Hàm định dạng tiền tệ
const formatCurrency = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/sanphams`);
        if (Array.isArray(res.data)) {
          setProducts(res.data);
          // Khởi tạo biến thể mặc định (màu 1)
          const defaultVariants = res.data.reduce((acc, item) => {
            acc[item._id] = {
              image: item.HinhAnh1,
              price: item.GiaSP1 || item.GiaSP,
              quantity: item.SoLuong1 || item.SoLuong,
              name: item.TenSP1,
            };
            return acc;
          }, {});
          setSelectedVariants(defaultVariants);
        } else {
          console.log("Dữ liệu không hợp lệ:", res.data);
          setProducts([]);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Cập nhật biến thể khi người dùng chọn ảnh
  const handleVariantChange = (
    id,
    variantImage,
    variantPrice,
    variantQuantity,
    variantName
  ) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [id]: {
        image: variantImage,
        price: variantPrice,
        quantity: variantQuantity,
        name: variantName,
      },
    }));
  };

  const removeItem = async (id) => {
    try {
      if (window.confirm("Bạn có muốn xóa sản phẩm không?")) {
        await axios.delete(`http://localhost:5000/api/sanphams/${id}`);
        setProducts(products.filter((item) => item._id !== id));
        alert("Sản phẩm đã được xóa thành công!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi xóa sản phẩm!");
    }
  };

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Có lỗi xảy ra: {error.message}</p>;

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <Link className="btn btn-primary mb-3" to="/admin/products/add">
        Thêm sản phẩm
      </Link>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">STT</th>
            <th scope="col">Mã SP</th>
            <th scope="col">Mã KM</th>
            <th scope="col">Tên SP</th>
            <th scope="col">Giá SP</th>
            <th scope="col">Số Lượng</th>
            <th scope="col">Hình Ảnh</th>
            <th scope="col">Chọn màu</th>
            <th scope="col">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => (
            <tr key={item._id}>
              <th scope="row">{index + 1}</th>
              <td>{item._id}</td>
              <td>{item.MaKM || "Không có mã KM"}</td>
              <td>{selectedVariants[item._id]?.name || item.TenSP1}</td>
              <td>
                {formatCurrency(
                  selectedVariants[item._id]?.price || item.GiaSP1
                )}
              </td>
              <td>{selectedVariants[item._id]?.quantity || item.SoLuong1}</td>
              <td>
                <img
                  src={selectedVariants[item._id]?.image || item.HinhAnh1}
                  alt="Sản phẩm"
                  width={79}
                />
              </td>
              <td>
                {/* Chọn màu cho sản phẩm */}
                {item.HinhAnh1 && item.GiaSP1 && item.SoLuong1 && (
                  <img
                    src={item.HinhAnh1}
                    alt="Màu 1"
                    width={
                      selectedVariants[item._id]?.image === item.HinhAnh1
                        ? 69
                        : 39
                    }
                    style={{
                      cursor: "pointer",
                      border: "1px solid gray",
                      marginRight: 6,
                      transition: "width 0.3s ease-in-out",
                      borderRadius: "6px",
                    }}
                    onClick={() =>
                      handleVariantChange(
                        item._id,
                        item.HinhAnh1,
                        item.GiaSP1,
                        item.SoLuong1,
                        item.TenSP1
                      )
                    }
                  />
                )}
                {item.HinhAnh2 && item.GiaSP2 && item.SoLuong2 && (
                  <img
                    src={item.HinhAnh2}
                    alt="Màu 2"
                    width={
                      selectedVariants[item._id]?.image === item.HinhAnh2
                        ? 69
                        : 39
                    }
                    style={{
                      cursor: "pointer",
                      border: "1px solid gray",
                      marginRight: 6,
                      transition: "width 0.3s ease-in-out",
                      borderRadius: "6px",
                    }}
                    onClick={() =>
                      handleVariantChange(
                        item._id,
                        item.HinhAnh2,
                        item.GiaSP2,
                        item.SoLuong2,
                        item.TenSP2
                      )
                    }
                  />
                )}
                {item.HinhAnh3 && item.GiaSP3 && item.SoLuong3 && (
                  <img
                    src={item.HinhAnh3}
                    alt="Màu 3"
                    width={
                      selectedVariants[item._id]?.image === item.HinhAnh3
                        ? 69
                        : 39
                    }
                    style={{
                      cursor: "pointer",
                      border: "1px solid gray",
                      transition: "width 0.3s ease-in-out",
                      borderRadius: "6px",
                    }}
                    onClick={() =>
                      handleVariantChange(
                        item._id,
                        item.HinhAnh3,
                        item.GiaSP3,
                        item.SoLuong3,
                        item.TenSP3
                      )
                    }
                  />
                )}
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => removeItem(item._id)}
                >
                  Xóa
                </button>{" "}
                <Link to={`/admin/products/edit/${item._id}`}>
                  <button className="btn btn-primary">Sửa</button>
                </Link>{" "}
                <Link to={`/admin/products/detail/${item._id}`}>
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
