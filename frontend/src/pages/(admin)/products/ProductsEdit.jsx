import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProducts, updateProducts, fetchBrands } from "../../../service/api";

const ProductsEdit = () => {
  const [brands, setBrands] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    MaSP: "",
    TenSP: "",
    TenTH: '',
    CapSac: '',
    MoTa: '',
    BoNhoTrong1: "",
    BoNhoTrong2: "",
    BoNhoTrong3: "",
    Mau1: "",
    Mau2: "",
    Mau3: "",
    ManHinh: "",
    created_at: "",
    HDH: "",
    CamSau: "",
    CamTruoc: "",
    CPU: "",
    LoaiPin: "",
    TrangThai: "",
    SoLuong1: "",
    SoLuong2: "",
    SoLuong3: "",
    GiaSP1: "",
    GiaSP2: "",
    GiaSP3: "",
    HinhAnh1: "",
    HinhAnh2: "",
    HinhAnh3: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    getProducts(id)
      .then((response) => {
        setProduct(response.data.data);
      })
      .catch(() => setError("Không thể tải dữ liệu sản phẩm."))
      .finally(() => setLoading(false));

    fetchBrands()
      .then((res) => setBrands(res.data.data))
      .catch(console.error);

  }, [id]); // Dependency array chỉ cần `id`


  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prevProduct) => {
      if (name === "TrangThai") {
        return {
          ...prevProduct,
          [name]: value,
          SoLuong1: value === "Hết hàng" ? "0" : prevProduct.SoLuong1,
          SoLuong2: value === "Hết hàng" ? "0" : prevProduct.SoLuong2,
          SoLuong3: value === "Hết hàng" ? "0" : prevProduct.SoLuong3, // Giữ nguyên số lượng khi chọn lại "Còn hàng"
        };
      }
      return { ...prevProduct, [name]: value };
    });
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    updateProducts(id, product)
      .then(() => {
        alert("Cập nhật sản phẩm thành công!");
        navigate("/admin/products");
      })
      .catch(() => {
        setError("Có lỗi xảy ra khi cập nhật sản phẩm.");
      });
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-2">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Chỉnh Sửa Sản Phẩm</h1>
        <Link to="/admin/products">
          <button className="btn btn-secondary">Quay lại</button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Thông Tin Sản Phẩm</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Mã Sản Phẩm</label>
                  <input
                    type="text"
                    className="form-control"
                    name="MaSP"
                    value={product.MaSP}
                    onChange={handleChange}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tên Sản Phẩm</label>
                  <input
                    type="text"
                    className="form-control"
                    name="TenSP"
                    value={product.TenSP}
                    onChange={handleChange}
                    required
                  />
                  {product.TenSP.trim() === "" && (
                    <div className="text-danger mt-1">Không được bỏ trống</div>
                  )}
                </div>


                <div className="mb-3">
                  <label className="form-label">Bộ Nhớ Trong 1</label>
                  <input
                    type="text"
                    className="form-control"
                    name="BoNhoTrong1"
                    value={product.BoNhoTrong1}
                    onChange={handleChange}
                    required
                  />
                  {product.BoNhoTrong1.trim() === "" && (
                    <div className="text-danger mt-1">Không được bỏ trống</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Bộ Nhớ Trong 2</label>
                  <input
                    type="text"
                    className="form-control"
                    name="BoNhoTrong2"
                    value={product.BoNhoTrong2}
                    onChange={handleChange}
                    required
                  />
                  {product.BoNhoTrong2.trim() === "" && (
                    <div className="text-danger mt-1">Không được bỏ trống</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Bộ Nhớ Trong 3</label>
                  <input
                    type="text"
                    className="form-control"
                    name="BoNhoTrong3"
                    value={product.BoNhoTrong3}
                    onChange={handleChange}
                    required
                  />
                  {product.BoNhoTrong3.trim() === "" && (
                    <div className="text-danger mt-1">Không được bỏ trống</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Màn Hình</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ManHinh"
                    value={product.ManHinh}
                    onChange={handleChange}
                    required
                  />
                  {product.ManHinh.trim() === "" && (
                    <div className="text-danger mt-1">Không được bỏ trống</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Giá 1</label>
                  <input
                    type="number"
                    className="form-control"
                    name="GiaSP1"
                    value={product.GiaSP1}
                    onChange={handleChange}
                    required
                  />
                  {(!product.GiaSP1 || product.GiaSP1 <= 0) && (
                    <div className="text-danger mt-1">Giá sản phẩm phải lớn hơn 0</div>
                  )}

                  <label className="form-label">Giá 2</label>
                  <input
                    type="number"
                    className="form-control"
                    name="GiaSP2"
                    value={product.GiaSP2}
                    onChange={handleChange}
                    required
                  />
                  {(!product.GiaSP2 || product.GiaSP2 <= 0) && (
                    <div className="text-danger mt-1">Giá sản phẩm phải lớn hơn 0</div>
                  )}

                  <label className="form-label">Giá 3</label>
                  <input
                    type="number"
                    className="form-control"
                    name="GiaSP3"
                    value={product.GiaSP3}
                    onChange={handleChange}
                    required
                  />
                  {(!product.GiaSP3 || product.GiaSP3 <= 0) && (
                    <div className="text-danger mt-1">Giá sản phẩm phải lớn hơn 0</div>
                  )}

                </div>

              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Hệ Điều Hành</label>
                  <input
                    type="text"
                    className="form-control"
                    name="HDH"
                    value={product.HDH}
                    onChange={handleChange}
                    required
                  />
                  {product.HDH.trim() === "" && (
                    <div className="text-danger mt-1">Không được bỏ trống</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Pin</label>
                  <input
                    type="text"
                    className="form-control"
                    name="LoaiPin"
                    value={product.LoaiPin}
                    onChange={handleChange}
                    required
                  />
                  {product.LoaiPin.trim() === "" && (
                    <div className="text-danger mt-1">Không được bỏ trống</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Trạng Thái</label>
                  <select
                    className="form-control"
                    name="TrangThai"
                    value={product.TrangThai}
                    onChange={handleChange}
                  >
                    <option value="Còn Hàng">Còn hàng</option>
                    <option value="Hết hàng">Hết hàng</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="TenTH">Thương Hiệu</label>
                  <select
                    id="TenTH"
                    name="TenTH"
                    className="form-control"
                    value={product.TenTH}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand.TenTH}>
                        {brand.TenTH}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Các trường màu */}
                <div className="mb-3">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <label className="form-label">Màu 1</label>
                    {/* Ô vuông hiển thị màu ngay cạnh chữ "Màu 1" */}
                    <div
                      style={{
                        backgroundColor: product.Mau1,
                        width: "20px",
                        height: "20px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    name="Mau1"
                    value={product.Mau1}
                    onChange={handleChange}
                    required
                  />
                  {product.Mau1.trim() === "" && (
                    <div className="text-danger mt-1">Không được bỏ trống</div>
                  )}
                </div>

                <div className="mb-3">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <label className="form-label">Màu 2</label>
                    {/* Ô vuông hiển thị màu ngay cạnh chữ "Màu 1" */}
                    <div
                      style={{
                        backgroundColor: product.Mau2,
                        width: "20px",
                        height: "20px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    name="Mau2"
                    value={product.Mau2}
                    onChange={handleChange}
                    required
                  />
                  {product.Mau2.trim() === "" && (
                    <div className="text-danger mt-1">Không được bỏ trống</div>
                  )}
                </div>


                <div className="mb-3">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <label className="form-label">Màu 1</label>
                    {/* Ô vuông hiển thị màu ngay cạnh chữ "Màu 1" */}
                    <div
                      style={{
                        backgroundColor: product.Mau3,
                        width: "20px",
                        height: "20px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    name="Mau3"
                    value={product.Mau3}
                    onChange={handleChange}
                    required
                  />
                  {product.Mau3.trim() === "" && (
                    <div className="text-danger mt-1">Không được bỏ trống</div>
                  )}
                </div>


                <div className="form-group">
                  <label htmlFor="CPU">CPU</label>
                  <input
                    type="text"
                    id="CPU"
                    name="CPU"
                    className="form-control"
                    value={product.CPU}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="CapSac">Cáp sạc</label>
                  <select
                    id="CapSac"
                    name="CapSac"
                    className="form-control"
                    value={product.CapSac}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn loại cáp</option>
                    <option value="Type-C">Type-C</option>
                    <option value="Lightning">Lightning</option>
                    <option value="USB">USB</option>
                  </select>
                </div>

              </div>
            </div>

            <hr />


            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Số Lượng 1</label>
                  <input
                    type="number"
                    className="form-control"
                    name="SoLuong1"
                    value={product.SoLuong1}
                    onChange={handleChange}
                    required
                    disabled={product.TrangThai === "Hết hàng"} // Vô hiệu hóa khi trạng thái là Hết hàng
                  />
                  {!product.SoLuong1 && product.SoLuong1 !== 0 && (
                    <div className="text-danger mt-1">Không được bỏ trống</div>
                  )}


                </div>

                <div className="mb-3">
                  <label className="form-label">Số Lượng 2</label>
                  <input
                    type="number"
                    className="form-control"
                    name="SoLuong2"
                    value={product.SoLuong2}
                    onChange={handleChange}
                    required
                    disabled={product.TrangThai === "Hết hàng"}
                  />
                  {!product.SoLuong2 && product.SoLuong2 !== 0 && (
                    <div className="text-danger mt-1">Không được bỏ trống</div>
                  )}


                </div>

                <div className="mb-3">
                  <label className="form-label">Số Lượng 3</label>
                  <input
                    type="number"
                    className="form-control"
                    name="SoLuong3"
                    value={product.SoLuong3}
                    onChange={handleChange}
                    required
                    disabled={product.TrangThai === "Hết hàng"}
                  />
                  {!product.SoLuong3 && product.SoLuong3 !== 0 && (
                    <div className="text-danger mt-1">Không được bỏ trống</div>
                  )}


                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Hình Ảnh</label>
                <div className="d-flex">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="mb-3 text-center">
                      <input
                        type="text"
                        className="form-control me-2"
                        name={`HinhAnh${index}`}
                        value={product[`HinhAnh${index}`]}
                        onChange={handleChange}
                        placeholder={`Link ảnh ${index}`}
                      />
                      {product[`HinhAnh${index}`] && (
                        <div className="mt-2">
                          <img
                            src={product[`HinhAnh${index}`]}
                            alt={`Hình Ảnh ${index}`}
                            style={{ width: "100%", maxHeight: "200px", objectFit: "contain" }}
                          />
                          <p className="mt-1 fw-bold">Hình {index}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

        <div className="form-group">
          <label htmlFor="MoTa">Mô tả</label>
          <textarea
            id="MoTa"
            name="MoTa"
            className="form-control"
            value={product.MoTa}
            onChange={handleChange}
            required
            rows={4} // Số dòng hiển thị
          />
        </div>


        <div className="mt-4 text-center">
          <button type="submit" className="btn btn-primary">Cập Nhật</button>
        </div>
      </form>
    </div>
  );
};

export default ProductsEdit;


