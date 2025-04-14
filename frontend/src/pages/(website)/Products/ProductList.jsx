import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../../service/api";
import { Spin, message, Pagination, Select, Input, Slider, Card, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Socket from "../socket/Socket";

const { Option } = Select;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [priceRange, setPriceRange] = useState([0, 100000000]);

  useEffect(() => {
    getProducts();

    // Lắng nghe sự kiện productCreated từ server
    Socket.on("productCreated", (newProduct) => {
      setProducts((prevProducts) => {
        return [newProduct, ...prevProducts];
      });
    });

    // Lắng nghe sự kiện productUpdated từ server
    Socket.on("productUpdated", (updatedProduct) => {
      setProducts((prevProducts) => {
        const productIndex = prevProducts.findIndex((p) => p._id === updatedProduct._id);
        let updatedProducts = [...prevProducts];

        if (productIndex !== -1) {
          updatedProducts[productIndex] = updatedProduct;
        } else {
          updatedProducts = [updatedProduct, ...updatedProducts];
        }

        return updatedProducts;
      });
    });

    // Dọn dẹp listener khi component unmount
    return () => {
      Socket.off("productCreated");
      Socket.off("productUpdated");
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  }, [selectedBrand, selectedStorage, searchQuery, sortOrder, priceRange]);

  const normalizeBrandName = (name) => {
    const match = name.match(/^(Iphone|Samsung|Xiaomi|Oppo)(\d+)/i);
    if (match) {
      const brand = match[1];
      const model = match[2];
      return `${brand} ${model}`;
    }
    return name.split(" ")[0];
  };

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts();
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setProducts(data);

      const uniqueBrands = [...new Set(data.map((product) => {
        const nameParts = product.TenSP.split("|")[0].trim();
        return normalizeBrandName(nameParts);
      }))];
      setBrands(uniqueBrands);
    } catch (error) {
      message.error("Lỗi khi tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm bộ nhớ và giá hợp lệ đầu tiên
  const getFirstValidMemoryAndPrice = (product) => {
    const memories = [
      product.BoNhoTrong1,
      product.BoNhoTrong2,
      product.BoNhoTrong3,
      product.BoNhoTrong4,
      product.BoNhoTrong5,
      product.BoNhoTrong6,
    ];
    const prices = [
      product.GiaSP1,
      product.GiaSP2,
      product.GiaSP3,
      product.GiaSP4,
      product.GiaSP5,
      product.GiaSP6,
    ];

    for (let i = 0; i < memories.length; i++) {
      if (memories[i] && memories[i].toLowerCase() !== "không có") {
        return { memory: memories[i], price: prices[i] };
      }
    }
    return { memory: null, price: null }; // Không xảy ra theo giả định
  };

  const sortedProducts = [...products]
    .filter((product) => selectedStorage ? product.BoNhoTrong1 === selectedStorage : true)
    .filter((product) => {
      if (!selectedBrand) return true;
      const normalizedProductName = normalizeBrandName(product.TenSP.split("|")[0].trim());
      return normalizedProductName.toLowerCase().startsWith(selectedBrand.toLowerCase());
    })
    .filter((product) => searchQuery ? product.TenSP.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    .filter((product) => {
      const { price } = getFirstValidMemoryAndPrice(product);
      const priceValue = Number(price) || 0;
      return priceValue >= priceRange[0] && priceValue <= priceRange[1];
    })
    .sort((a, b) => {
      const { price: priceA } = getFirstValidMemoryAndPrice(a);
      const { price: priceB } = getFirstValidMemoryAndPrice(b);
      const priceAValue = Number(priceA) || 0;
      const priceBValue = Number(priceB) || 0;
      if (sortOrder === "asc") return priceAValue - priceBValue;
      if (sortOrder === "desc") return priceBValue - priceAValue;
      return 0;
    });

  const indexOfLastProduct = currentPage * pageSize;
  const indexOfFirstProduct = indexOfLastProduct - pageSize;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const formatPrice = (value) => {
    return `${value.toLocaleString()} VNĐ`;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">📢 Danh sách sản phẩm</h2>

        <Card className="mb-8" title="Bộ lọc sản phẩm" bordered={false}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Tất cả thương hiệu"
                value={selectedBrand || undefined}
                onChange={(value) => setSelectedBrand(value)}
                allowClear
                size="large"
                style={{ width: "100%" }}
              >
                {brands.map((brand) => (
                  <Option key={brand} value={brand}>{brand}</Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                size="large"
                style={{ width: "100%" }}
              />
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Chọn bộ nhớ"
                value={selectedStorage || undefined}
                onChange={(value) => setSelectedStorage(value)}
                allowClear
                size="large"
                style={{ width: "100%" }}
              >
                <Option value="32GB">32GB</Option>
                <Option value="64GB">64GB</Option>
                <Option value="128GB">128GB</Option>
                <Option value="256GB">256GB</Option>
                <Option value="512GB">512GB</Option>
                <Option value="1TB">1TB</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Sắp xếp theo giá"
                value={sortOrder || undefined}
                onChange={(value) => setSortOrder(value)}
                allowClear
                size="large"
                style={{ width: "100%" }}
              >
                <Option value="asc">Giá thấp đến cao</Option>
                <Option value="desc">Giá cao đến thấp</Option>
              </Select>
            </Col>

            <Col xs={24} md={4}>
              <div>
                <span className="text-sm font-medium text-gray-700">Khoảng giá:</span>
                <Slider
                  range
                  min={0}
                  max={100000000}
                  step={100000}
                  defaultValue={[0, 100000000]}
                  value={priceRange}
                  onChange={handlePriceChange}
                  tooltip={{ formatter: formatPrice }}
                  style={{ marginTop: 8 }}
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => {
                const { memory, price } = getFirstValidMemoryAndPrice(product);
                const isOutOfStock =
                  product.SoLuong1 === 0 &&
                  product.SoLuong2 === 0 &&
                  product.SoLuong3 === 0 &&
                  product.SoLuong4 === 0 &&
                  product.SoLuong5 === 0 &&
                  product.SoLuong6 === 0;

                return (
                  <Link
                    to={`/products/product_detail/${product._id}`}
                    key={product._id}
                    className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 p-5 border border-gray-200 hover:border-gray-400"
                  >
                    <div className="h-56 flex justify-center items-center bg-gray-100 rounded-lg">
                      <img
                        src={product.HinhAnh1}
                        alt={product.TenSP}
                        className="h-full w-full object-contain bg-white p-2 rounded-lg"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <h3 className="text-lg font-semibold text-gray-800 break-words">{product.TenSP}</h3>
                      <p className="text-sm text-gray-600 mt-1">Bộ nhớ: {memory}</p>
                      <p
                        className={`font-bold text-lg mt-3 px-2 py-1 rounded-md ${
                          isOutOfStock ? "text-gray-500 bg-gray-300" : "text-blue-600 bg-blue-200"
                        }`}
                      >
                        {isOutOfStock
                          ? "Liên hệ"
                          : price
                          ? `${new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(price)}`
                          : "Chưa có giá"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={sortedProducts.length}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;