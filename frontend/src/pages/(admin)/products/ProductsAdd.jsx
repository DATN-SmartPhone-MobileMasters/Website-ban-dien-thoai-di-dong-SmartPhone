import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProducts, fetchBrands, uploadImage } from "../../../service/api";
import { message } from 'antd';

const ProductsAdd = () => {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();
  const [mainProduct, setMainProduct] = useState({
    TenSP: '', // Tên sản phẩm chung
    ThuongHieu: '', // Thương hiệu chung
    CamTruoc: '', // Camera trước chung
    CamSau: '', // Camera sau chung
    CPU: '', // CPU chung
    ManHinh: '', // Màn hình chung
    HDH: '', // Hệ điều hành chung
    LoaiPin: '', // Loại pin chung
    CapSac: '', // Cáp sạc chung
    BoNhoTrong1: '', // Bộ nhớ trong 1 chung
    BoNhoTrong2: '', // Bộ nhớ trong 2 chung
    BoNhoTrong3: '', // Bộ nhớ trong 3 chung
    GiaSP1: '', // Giá sản phẩm 1 chung
    GiaSP2: '', // Giá sản phẩm 2 chung
    GiaSP3: '', // Giá sản phẩm 3 chung
  });
  const [products, setProducts] = useState([
    {
      MaSP: '',
      MoTa: '',
      Mau1: '',
      SoLuong1: '',
      SoLuong2: '',
      SoLuong3: '',
      TrangThai: '',
      HinhAnh1: '',
      HinhAnh2: '',
      HinhAnh3: '',
      HinhAnh4: '',
      HinhAnh5: '',
      HinhAnh6: '',
    },
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBrands()
      .then((res) => setBrands(res.data.data))
      .catch(console.error);
  }, []);

  // Xử lý thay đổi trường Tên Sản Phẩm chung và các trường dùng chung
  const handleMainProductChange = (e) => {
    const { name, value } = e.target;
    setMainProduct({
      ...mainProduct,
      [name]: value,
    });
  };

  // Xử lý thay đổi các trường trong form sản phẩm
  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [name]: value,
    };
    setProducts(updatedProducts);
  };

  // Xử lý upload hình ảnh
  const handleImageUpload = async (index, e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await uploadImage(formData);
      console.log('Image upload response:', response.data);
      const updatedProducts = [...products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [fieldName]: response.data.imageUrl,
      };
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Image upload error:', error);
      setError(`Tải ảnh ${fieldName} lên thất bại`);
    }
  };

  // Thêm form sản phẩm mới
  const handleAddForm = () => {
    setProducts([
      ...products,
      {
        MaSP: '',
        MoTa: '',
        Mau1: '',
        SoLuong1: '',
        SoLuong2: '',
        SoLuong3: '',
        TrangThai: '',
        HinhAnh1: '',
        HinhAnh2: '',
        HinhAnh3: '',
      },
    ]);
  };

  // Xóa form sản phẩm
  const handleRemoveForm = (index) => {
    if (index === 0) return; // Không cho phép xóa form đầu tiên
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  // Thêm từng sản phẩm
  const handleAddProduct = async (index) => {
    setLoading(true);
    const productToAdd = {
      ...products[index],
      TenSP: mainProduct.TenSP, // Dùng chung TenSP từ form chính
      ThuongHieu: mainProduct.ThuongHieu, // Dùng chung ThuongHieu từ form chính
      CamTruoc: mainProduct.CamTruoc, // Dùng chung CamTruoc từ form chính
      CamSau: mainProduct.CamSau, // Dùng chung CamSau từ form chính
      CPU: mainProduct.CPU, // Dùng chung CPU từ form chính
      ManHinh: mainProduct.ManHinh, // Dùng chung ManHinh từ form chính
      HDH: mainProduct.HDH, // Dùng chung HDH từ form chính
      LoaiPin: mainProduct.LoaiPin, // Dùng chung LoaiPin từ form chính
      CapSac: mainProduct.CapSac, // Dùng chung CapSac từ form chính
      BoNhoTrong1: mainProduct.BoNhoTrong1, // Dùng chung BoNhoTrong1 từ form chính
      BoNhoTrong2: mainProduct.BoNhoTrong2, // Dùng chung BoNhoTrong2 từ form chính
      BoNhoTrong3: mainProduct.BoNhoTrong3, // Dùng chung BoNhoTrong3 từ form chính
      GiaSP1: mainProduct.GiaSP1, // Dùng chung GiaSP1 từ form chính
      GiaSP2: mainProduct.GiaSP2, // Dùng chung GiaSP2 từ form chính
      GiaSP3: mainProduct.GiaSP3, // Dùng chung GiaSP3 từ form chính
    };

    try {
      await createProducts(productToAdd);
      message.success(`Thêm sản phẩm ${index + 1} thành công!`);
      if (index === products.length - 1) {
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Create product error:', error.response?.data);
      setError(error.response?.data?.message || 'Không thể thêm sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  // Thêm tất cả sản phẩm
  const handleAddAllProducts = async () => {
    setLoading(true);
    try {
      for (const product of products) {
        const productToAdd = {
          ...product,
          TenSP: mainProduct.TenSP, // Dùng chung TenSP từ form chính
          ThuongHieu: mainProduct.ThuongHieu, // Dùng chung ThuongHieu từ form chính
          CamTruoc: mainProduct.CamTruoc, // Dùng chung CamTruoc từ form chính
          CamSau: mainProduct.CamSau, // Dùng chung CamSau từ form chính
          CPU: mainProduct.CPU, // Dùng chung CPU từ form chính
          ManHinh: mainProduct.ManHinh, // Dùng chung ManHinh từ form chính
          HDH: mainProduct.HDH, // Dùng chung HDH từ form chính
          LoaiPin: mainProduct.LoaiPin, // Dùng chung LoaiPin từ form chính
          CapSac: mainProduct.CapSac, // Dùng chung CapSac từ form chính
          BoNhoTrong1: mainProduct.BoNhoTrong1, // Dùng chung BoNhoTrong1 từ form chính
          BoNhoTrong2: mainProduct.BoNhoTrong2, // Dùng chung BoNhoTrong2 từ form chính
          BoNhoTrong3: mainProduct.BoNhoTrong3, // Dùng chung BoNhoTrong3 từ form chính
          GiaSP1: mainProduct.GiaSP1, // Dùng chung GiaSP1 từ form chính
          GiaSP2: mainProduct.GiaSP2, // Dùng chung GiaSP2 từ form chính
          GiaSP3: mainProduct.GiaSP3, // Dùng chung GiaSP3 từ form chính
        };
        await createProducts(productToAdd);
      }
      navigate('/admin/products');
      message.success('Thêm tất cả sản phẩm thành công!');
    } catch (error) {
      console.error('Create product error:', error.response?.data);
      setError(error.response?.data?.message || 'Không thể thêm sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4">Thêm Sản Phẩm</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Form chính để nhập Tên Sản Phẩm chung và các trường dùng chung */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="TenSP">Tên Sản Phẩm (Chung)</label>
            <input
              type="text"
              id="TenSP"
              name="TenSP"
              className="form-control"
              value={mainProduct.TenSP}
              onChange={handleMainProductChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ThuongHieu">Thương Hiệu</label>
            <select
              id="ThuongHieu"
              name="ThuongHieu"
              className="form-control"
              value={mainProduct.ThuongHieu}
              onChange={handleMainProductChange}
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
          <div className="form-group">
            <label htmlFor="CamTruoc">Camera Trước</label>
            <select
              id="CamTruoc"
              name="CamTruoc"
              className="form-control"
              value={mainProduct.CamTruoc}
              onChange={handleMainProductChange}
              required
            >
              <option value="">Chọn độ phân giải</option>
              <option value="30px">30 PX</option>
              <option value="35px">35 PX</option>
              <option value="40px">40 PX</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="CamSau">Camera Sau</label>
            <select
              id="CamSau"
              name="CamSau"
              className="form-control"
              value={mainProduct.CamSau}
              onChange={handleMainProductChange}
              required
            >
              <option value="">Chọn độ phân giải</option>
              <option value="16px">16 PX</option>
              <option value="20px">20 PX</option>
              <option value="25px">25 PX</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="CPU">CPU</label>
            <select
              id="CPU"
              name="CPU"
              className="form-control"
              value={mainProduct.CPU}
              onChange={handleMainProductChange}
              required
            >
              <option value="">Chọn loại CPU</option>
              <option value="APPLE CHIPSET">APPLE CHIPSET</option>
              <option value="ANDROID CHIPSET">ANDROID CHIPSET</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="ManHinh">Màn Hình</label>
            <select
              id="ManHinh"
              name="ManHinh"
              className="form-control"
              value={mainProduct.ManHinh}
              onChange={handleMainProductChange}
              required
            >
              <option value="">Chọn kích thước màn hình</option>
              <option value="5inch">5 inch</option>
              <option value="5.1inch">5.1 inch</option>
              <option value="6inch">6 inch</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="HDH">Hệ Điều Hành</label>
            <select
              id="HDH"
              name="HDH"
              className="form-control"
              value={mainProduct.HDH}
              onChange={handleMainProductChange}
              required
            >
              <option value="">Chọn hệ điều hành</option>
              <option value="IOS">IOS</option>
              <option value="ANDROID">ANDROID</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="LoaiPin">Loại Pin</label>
            <select
              id="LoaiPin"
              name="LoaiPin"
              className="form-control"
              value={mainProduct.LoaiPin}
              onChange={handleMainProductChange}
              required
            >
              <option value="">Chọn loại pin</option>
              <option value="PISEN">PISEN</option>
              <option value="Energizer">Energizer</option>
              <option value="Duracell">Duracell</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="CapSac">Cáp Sạc</label>
            <select
              id="CapSac"
              name="CapSac"
              className="form-control"
              value={mainProduct.CapSac}
              onChange={handleMainProductChange}
              required
            >
              <option value="">Chọn loại cáp</option>
              <option value="Type-C">Type-C</option>
              <option value="Lightning">Lightning</option>
              <option value="USB">USB</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="BoNhoTrong1">Bộ Nhớ Trong 1</label>
            <select
              id="BoNhoTrong1"
              name="BoNhoTrong1"
              className="form-control"
              value={mainProduct.BoNhoTrong1}
              onChange={handleMainProductChange}
              required
            >
              <option value="">Chọn bộ nhớ</option>
              <option value="64GB">64GB</option>
              <option value="128GB">128GB</option>
              <option value="256GB">256GB</option>
              <option value="512GB">512GB</option>
              <option value="1TB">1TB</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="BoNhoTrong2">Bộ Nhớ Trong 2</label>
            <select
              id="BoNhoTrong2"
              name="BoNhoTrong2"
              className="form-control"
              value={mainProduct.BoNhoTrong2}
              onChange={handleMainProductChange}
              required
            >
              <option value="">Chọn bộ nhớ</option>
              <option value="64GB">64GB</option>
              <option value="128GB">128GB</option>
              <option value="256GB">256GB</option>
              <option value="512GB">512GB</option>
              <option value="1TB">1TB</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="BoNhoTrong3">Bộ Nhớ Trong 3</label>
            <select
              id="BoNhoTrong3"
              name="BoNhoTrong3"
              className="form-control"
              value={mainProduct.BoNhoTrong3}
              onChange={handleMainProductChange}
              required
            >
              <option value="">Chọn bộ nhớ</option>
              <option value="64GB">64GB</option>
              <option value="128GB">128GB</option>
              <option value="256GB">256GB</option>
              <option value="512GB">512GB</option>
              <option value="1TB">1TB</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="GiaSP1">Giá 1</label>
            <input
              type="number"
              id="GiaSP1"
              name="GiaSP1"
              className="form-control"
              value={mainProduct.GiaSP1}
              onChange={handleMainProductChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="GiaSP2">Giá 2</label>
            <input
              type="number"
              id="GiaSP2"
              name="GiaSP2"
              className="form-control"
              value={mainProduct.GiaSP2}
              onChange={handleMainProductChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="GiaSP3">Giá 3</label>
            <input
              type="number"
              id="GiaSP3"
              name="GiaSP3"
              className="form-control"
              value={mainProduct.GiaSP3}
              onChange={handleMainProductChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Danh sách các form sản phẩm */}
      {products.map((product, index) => (
        <div key={index} className="card shadow mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h3>Form Sản Phẩm {index + 1}</h3>
              {index > 0 && ( // Chỉ hiển thị nút "x" từ form thứ 2 trở đi
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveForm(index)}
                >
                  &times;
                </button>
              )}
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor={`MaSP-${index}`}>Mã Sản Phẩm</label>
                  <input
                    type="text"
                    id={`MaSP-${index}`}
                    name="MaSP"
                    className="form-control"
                    value={product.MaSP}
                    onChange={(e) => handleProductChange(index, e)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`MoTa-${index}`}>Mô Tả</label>
                  <input
                    type="text"
                    id={`MoTa-${index}`}
                    name="MoTa"
                    className="form-control"
                    value={product.MoTa}
                    onChange={(e) => handleProductChange(index, e)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="TrangThai">Trạng Thái</label>
                  <select
                    id="TrangThai"
                    name="TrangThai"
                    className="form-control"
                    value={product.TrangThai}
                    onChange={(e) => handleProductChange(index, e)}
                  >
                    <option value="">Vui lòng chọn</option>
                    <option value="Còn hàng">Còn hàng</option>
                    <option value="Hết hàng">Hết hàng</option>
                  </select>
                </div>

                <div className="form-group">
  <label htmlFor={`Mau1-${index}`}>Màu Sắc</label>
  <input
    type="text"
    id={`Mau1-${index}`}
    name="Mau1"
    className="form-control"
    value={product.Mau1}
    onChange={(e) => handleProductChange(index, e)}
    placeholder="Nhập màu sắc"
  />
</div>

                <div className="form-group">
                  <label htmlFor={`SoLuong1-${index}`}>Số Lượng Bộ Nhớ 1</label>
                  <input
                    type="number"
                    id={`SoLuong1-${index}`}
                    name="SoLuong1"
                    className="form-control"
                    value={product.SoLuong1}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`SoLuong2-${index}`}>Số Lượng Bộ Nhớ 2</label>
                  <input
                    type="number"
                    id={`SoLuong2-${index}`}
                    name="SoLuong2"
                    className="form-control"
                    value={product.SoLuong2}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`SoLuong3-${index}`}>Số Lượng Bộ Nhớ 3</label>
                  <input
                    type="number"
                    id={`SoLuong3-${index}`}
                    name="SoLuong3"
                    className="form-control"
                    value={product.SoLuong3}
                    onChange={(e) => handleProductChange(index, e)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor={`HinhAnh1-${index}`}>Hình Ảnh 1</label>
                  <input
                    type="file"
                    id={`HinhAnh1-${index}`}
                    className="form-control"
                    onChange={(e) => handleImageUpload(index, e, 'HinhAnh1')}
                    accept="image/*"
                    required
                  />
                  {product.HinhAnh1 && (
                    <img
                      src={product.HinhAnh1}
                      alt="Preview 1"
                      style={{ marginTop: '10px', maxWidth: '150px', maxHeight: '150px' }}
                    />
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor={`HinhAnh2-${index}`}>Hình Ảnh 2</label>
                  <input
                    type="file"
                    id={`HinhAnh2-${index}`}
                    className="form-control"
                    onChange={(e) => handleImageUpload(index, e, 'HinhAnh2')}
                    accept="image/*"
                  />
                  {product.HinhAnh2 && (
                    <img
                      src={product.HinhAnh2}
                      alt="Preview 2"
                      style={{ marginTop: '10px', maxWidth: '150px', maxHeight: '150px' }}
                    />
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor={`HinhAnh3-${index}`}>Hình Ảnh 3</label>
                  <input
                    type="file"
                    id={`HinhAnh3-${index}`}
                    className="form-control"
                    onChange={(e) => handleImageUpload(index, e, 'HinhAnh3')}
                    accept="image/*"
                  />
                  {product.HinhAnh3 && (
                    <img
                      src={product.HinhAnh3}
                      alt="Preview 3"
                      style={{ marginTop: '10px', maxWidth: '150px', maxHeight: '150px' }}
                    />
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor={`HinhAnh4-${index}`}>Hình Ảnh 4</label>
                  <input
                    type="file"
                    id={`HinhAnh4-${index}`}
                    className="form-control"
                    onChange={(e) => handleImageUpload(index, e, 'HinhAnh4')}
                    accept="image/*"
                  />
                  {product.HinhAnh4 && (
                    <img
                      src={product.HinhAnh5}
                      alt="Preview 3"
                      style={{ marginTop: '10px', maxWidth: '150px', maxHeight: '150px' }}
                    />
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor={`HinhAnh5-${index}`}>Hình Ảnh 5</label>
                  <input
                    type="file"
                    id={`HinhAnh5-${index}`}
                    className="form-control"
                    onChange={(e) => handleImageUpload(index, e, 'HinhAnh5')}
                    accept="image/*"
                  />
                  {product.HinhAnh5 && (
                    <img
                      src={product.HinhAnh5}
                      alt="Preview 3"
                      style={{ marginTop: '10px', maxWidth: '150px', maxHeight: '150px' }}
                    />
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor={`HinhAnh6-${index}`}>Hình Ảnh 6</label>
                  <input
                    type="file"
                    id={`HinhAnh6-${index}`}
                    className="form-control"
                    onChange={(e) => handleImageUpload(index, e, 'HinhAnh6')}
                    accept="image/*"
                  />
                  {product.HinhAnh6 && (
                    <img
                      src={product.HinhAnh6}
                      alt="Preview 3"
                      style={{ marginTop: '10px', maxWidth: '150px', maxHeight: '150px' }}
                    />
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleAddProduct(index)}
              disabled={loading}
            >
              {loading ? 'Đang thêm...' : `Thêm Sản Phẩm ${index + 1}`}
            </button>
          </div>
        </div>
      ))}

      {/* Nút thêm form mới và thêm tất cả sản phẩm */}
      <div className="mt-4">
        <button type="button" className="btn btn-secondary mr-2" onClick={handleAddForm}>
          Thêm Form Sản Phẩm
        </button>
        <button type="button" className="btn btn-success" onClick={handleAddAllProducts} disabled={loading}>
          {loading ? 'Đang thêm tất cả...' : 'Thêm Tất Cả Sản Phẩm'}
        </button>
      </div>
    </div>
  );
};

export default ProductsAdd;