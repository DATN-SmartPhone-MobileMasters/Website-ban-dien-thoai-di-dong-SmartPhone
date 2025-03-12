import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../../service/api";
import { Spin, message } from "antd";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts();
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setProducts(data);

      const uniqueBrands = [...new Set(data.map(product => product.TenSP.split(" ")[0]))];
      setBrands(uniqueBrands);

      const prices = data.map(product => Number(product.GiaSP1) || 0);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setMinPrice(min);
      setMaxPrice(max);
      setPriceRange([min, max]);
    } catch (error) {
      message.error("Lỗi khi tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const resetPriceFilter = () => {
    setPriceRange([minPrice, maxPrice]);
  };

  const sortedProducts = [...products]
    .filter((product) =>
      selectedStorage ? product.BoNhoTrong1 === selectedStorage : true
    )
    .filter((product) =>
      selectedBrand ? product.TenSP.toLowerCase().includes(selectedBrand.toLowerCase()) : true
    )
    .filter((product) =>
      searchQuery ? product.TenSP.toLowerCase().includes(searchQuery.toLowerCase()) : true
    )
    .filter((product) => {
      const price = Number(product.GiaSP1) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .sort((a, b) => {
      const priceA = Number(a.GiaSP1) || 0;
      const priceB = Number(b.GiaSP1) || 0;
      if (sortOrder === "asc") return priceA - priceB;
      if (sortOrder === "desc") return priceB - priceA;
      return 0;
    });


  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between mb-4 gap-4">
          <select
            className="p-2 border rounded text-sm"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">Tất cả sản phẩm</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          <input
            type="text"
            className="p-2 border rounded text-sm"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />


          <select
            className="p-2 border rounded text-sm"
            value={selectedStorage}
            onChange={(e) => setSelectedStorage(e.target.value)}
          >
            <option value="">Bộ nhớ</option>
            <option value="64GB">64GB</option>
            <option value="128GB">128GB</option>
            <option value="256GB">256GB</option>
            <option value="512GB">512GB</option>
            <option value="1TB">1TB</option>
          </select>

          <select
            className="p-2 border rounded text-sm"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Sắp xếp theo</option>
            <option value="asc">Giá thấp đến cao</option>
            <option value="desc">Giá cao đến thấp</option>
          </select>

          {/* Dropdown lọc khoảng giá */}
          <div className="relative">
            <button
              className="p-2 border rounded text-sm bg-white shadow"
              onClick={() => setShowPriceFilter(!showPriceFilter)}
            >
              Lọc theo giá
            </button>

            {showPriceFilter && (
              <div className="absolute left-0 mt-2 w-60 bg-white border rounded shadow-lg p-4 z-10">
                <label className="text-sm font-medium block mb-2">
                  Khoảng giá ({priceRange[0].toLocaleString()}₫ - {priceRange[1].toLocaleString()}₫)
                </label>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full"
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />

                {/* Nút hủy lọc */}
                <div className="flex justify-between mt-4">
                  <button
                    className="text-red-500 text-sm"
                    onClick={resetPriceFilter}
                  >
                    Hủy lọc
                  </button>
                  <button
                    className="text-blue-500 text-sm"
                    onClick={() => setShowPriceFilter(false)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <Spin size="large" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <div key={product.id} className="border p-4 rounded-lg shadow-lg bg-white transition-transform duration-300 transform hover:scale-105">
                <div className="product-img mb-4">
                  <Link to={`/products/product_detail/${product._id}`}>
                    <img
                      src={product.HinhAnh1}
                      alt={product.TenSP}
                      className="object-contain rounded-md w-full h-60 bg-white"
                    />
                  </Link>
                </div>

                <h5 className="text-sm text-center">
                  <Link to={`/products/product_detail/${product.id}`} className="font-semibold">
                    {product.TenSP} <strong>({product.BoNhoTrong1})</strong>
                  </Link>
                </h5>
                <div className="my-2 text-sm text-center">
                  <span className="font-semibold text-orange-500">
                    {product.GiaSP1.toLocaleString()}₫
                  </span>
                </div>
                <div className="mt-4 text-center">
                  <button className="text-blue-500 hover:text-blue-700">
                    <i className="fa fa-shopping-cart" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
