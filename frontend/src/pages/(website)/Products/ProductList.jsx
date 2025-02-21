import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [isOSOpen, setIsOSOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 text-sm text-gray-700">
                <Link to="/" className="hover:text-blue-600">
                  Trang chủ
                </Link>
                <span> &gt; </span>
                <span>Sản Phẩm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 flex">
        {/* Sidebar */}
        <div className="w-1/4 bg-white p-4 rounded-lg shadow-md mt-16">
          <div className="mb-4 text-sm">
            <button
              className="text-base font-semibold w-full text-left flex justify-between hover:text-red-500 transition-colors duration-200"
              onClick={() => setIsOSOpen(!isOSOpen)}
            >
              <span className="relative top-2">HỆ ĐIỀU HÀNH</span>{" "}
              <span>{isOSOpen ? "-" : "+"}</span>
            </button>
            <ul
              className={`overflow-hidden transition-all duration-700 ease-in-out ${
                isOSOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <li className="p-2 mt-2 border-b flex items-center">
                <input type="checkbox" className="mr-2" /> Tất cả
              </li>
              <li className="p-2 border-b flex items-center">
                <input type="checkbox" className="mr-2" /> Android
              </li>
              <li className="p-2 flex items-center">
                <input type="checkbox" className="mr-2" /> iOS
              </li>
            </ul>
          </div>

          <div className="mb-4 text-sm">
            <button
              className="text-base font-semibold w-full text-left flex justify-between hover:text-red-500 transition-colors duration-200"
              onClick={() => setIsBrandOpen(!isBrandOpen)}
            >
              <span className="relative top-2">HÃNG SẢN XUẤT</span>{" "}
              <span>{isBrandOpen ? "-" : "+"}</span>
            </button>
            <ul
              className={`overflow-hidden transition-all duration-700 ease-in-out ${
                isBrandOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <li className="p-2 mt-2 border-b flex items-center">
                <input type="checkbox" className="mr-2" /> Tất cả
              </li>
              <li className="p-2 border-b flex items-center">
                <input type="checkbox" className="mr-2" /> Samsung
              </li>
              <li className="p-2 flex items-center">
                <input type="checkbox" className="mr-2" /> Apple
              </li>
            </ul>
          </div>

          <div className="mb-4 text-sm">
            <button
              className="text-base font-semibold w-full text-left flex justify-between hover:text-red-500 transition-colors duration-200"
              onClick={() => setIsPriceOpen(!isPriceOpen)}
            >
              <span className="relative top-2">GIÁ BÁN</span>{" "}
              <span>{isPriceOpen ? "-" : "+"}</span>
            </button>
            <ul
              className={`overflow-hidden transition-all duration-700 ease-in-out ${
                isPriceOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <li className="mt-2 p-2 border-b flex items-center">
                <input type="checkbox" className="mr-2" /> Tất cả
              </li>
              <li className="p-2 border-b flex items-center">
                <input type="checkbox" className="mr-2" /> Dưới 2 triệu
              </li>
              <li className="p-2 flex items-center">
                <input type="checkbox" className="mr-2" /> Từ 2 - 5 triệu
              </li>
            </ul>
          </div>
        </div>

        {/* Product List */}
        <div className="w-3/4 pl-6">
          <div className="flex justify-end mb-4">
            <select className="p-2 border rounded text-sm">
              <option>Sắp xếp theo</option>
              <option>Bán chạy</option>
              <option>Giá thấp</option>
              <option>Giá cao</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border p-4 rounded-lg shadow-lg bg-white h-auto flex flex-col items-center">
              <div className="product-img mb-4 w-full h-60 flex justify-center items-center">
                <Link to="/products/product_detail/1">
                  <img
                    src="./src/./img/product_img_1.png"
                    alt="Google Pixel"
                    className="object-cover rounded-md max-h-full"
                  />
                </Link>
              </div>
              <h5 className="text-sm text-center">
                <Link to="#" className="font-semibold">
                  Google Pixel <strong>(128GB, Black)</strong>
                </Link>
              </h5>
              <div className="my-2 text-sm text-center">
                <span className="font-semibold text-orange-500">$1100</span>
                <span className="text-gray-500 line-through ml-2">$1400</span>
                <span className="text-red-500 text-sm ml-2">20% off</span>
              </div>
              <div className="flex space-x-4 mt-4">
                <button className="text-red-500 hover:text-red-700">
                  <i className="fa fa-heart" />
                </button>
                <button className="text-blue-500 hover:text-blue-700">
                  <i className="fa fa-shopping-cart" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
