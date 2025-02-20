import React from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  return (
    <>
      <div>
        <div className="bg-gray-100 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2 text-sm text-gray-700">
                  <a href="index.html" className="hover:text-blue-600">
                    Trang chủ
                  </a>
                  <span> &gt; </span>
                  <span>Điện thoại</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* product-list */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex">
            <div className="w-full md:w-1/4 lg:w-1/4 xl:w-1/4">
              {/* sidenav-section */}
              <div id="cssmenu" className="space-y-6">
                <ul className="space-y-4">
                  <li className="has-sub">
                    <a href="#" className="block text-lg font-semibold">
                      Hệ điều hành
                    </a>
                    <ul className="ml-4 space-y-2">
                      <li>
                        <label>
                          <input type="checkbox" /> Tất cả
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> Android
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> IOS
                        </label>
                      </li>
                    </ul>
                  </li>
                  <li className="has-sub">
                    <a href="#" className="block text-lg font-semibold">
                      Hãng sản xuất
                    </a>
                    <ul className="ml-4 space-y-2">
                      <li>
                        <label>
                          <input type="checkbox" /> Tất cả
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> Samsung
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> Apple
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> Xiaomi
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> Vsmart
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> OPPO
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> Vivo
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> Nokia
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> Huawei
                        </label>
                      </li>
                    </ul>
                  </li>
                  <li className="has-sub">
                    <a href="#" className="block text-lg font-semibold">
                      Giá Bán
                    </a>
                    <ul className="ml-4 space-y-2">
                      <li>
                        <label>
                          <input type="checkbox" /> Tất cả
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> Dưới 2 triệu
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> Từ 2 - 5 triệu
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> Từ 5 - 10 triệu
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> Từ 10 - 15 triệu
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> Trên 15 triệu
                        </label>
                      </li>
                    </ul>
                  </li>
                  <li className="has-sub">
                    <a href="#" className="block text-lg font-semibold">
                      Màn hình
                    </a>
                    <ul className="ml-4 space-y-2">
                      <li>
                        <label>
                          <input type="checkbox" /> Tất cả
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> Dưới 5.0 inch
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> Trên 6.0 inch
                        </label>
                      </li>
                    </ul>
                  </li>
                  <li className="has-sub">
                    <a href="#" className="block text-lg font-semibold">
                      Bộ nhớ trong
                    </a>
                    <ul className="ml-4 space-y-2">
                      <li>
                        <label>
                          <input type="checkbox" /> Tất cả
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> Dưới 32GB
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> 64GB và 128GB
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> 256GB và 512GB
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="checkbox" /> Trên 512GB
                        </label>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              {/* /.sidenav-section */}
            </div>

            <div className="w-full md:w-3/4 lg:w-3/4 xl:w-3/4">
              <div className="flex justify-end mb-4">
                <form>
                  <div className="form-group">
                    <select name="select" className="form-control py-2 px-4 ">
                      <option value default>
                        Sắp xếp theo
                      </option>
                      <option value>Bán Chạy</option>
                      <option value>Giá Thấp</option>
                      <option value>Giá Cao</option>
                    </select>
                  </div>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* product */}
                <div className="product-block border p-4 rounded-lg shadow-lg flex flex-col h-full">
                  <div className="product-img mb-4">
                    <Link to={"/products/product_detail/1"}>
                      <img
                        src="./src/./img/product_img_1.png"
                        alt="Google Pixel"
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </Link>
                  </div>
                  <div className="product-content flex-grow">
                    <h5>
                      <a
                        href="#"
                        className="product-title text-lg font-semibold"
                      >
                        Google Pixel <strong>(128GB, Black)</strong>
                      </a>
                    </h5>
                    <div className="product-meta my-2">
                      <a
                        href="#"
                        className="product-price text-lg font-semibold text-orange-500"
                      >
                        $1100
                      </a>
                      <a
                        href="#"
                        className="discounted-price text-gray-500 line-through ml-2"
                      >
                        $1400
                      </a>
                      <span className="offer-price text-red-500 text-sm ml-2">
                        20%off
                      </span>
                    </div>
                  </div>
                  <div className="shopping-btn flex space-x-4 mt-4">
                    <a
                      href="#"
                      className="product-btn btn-like text-red-500 hover:text-red-700"
                    >
                      <i className="fa fa-heart" />
                    </a>
                    <a
                      href="#"
                      className="product-btn btn-cart text-blue-500 hover:text-blue-700"
                    >
                      <i className="fa fa-shopping-cart" />
                    </a>
                  </div>
                </div>
                {/* /.product */}
              </div>

              <div className="mt-8 flex justify-center">
                <div className="pagination">
                  <ul className="flex space-x-4">
                    <li>
                      <a
                        href="#"
                        aria-label="previous"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <i className="fa fa-angle-left" />
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-600 hover:text-blue-600">
                        1
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-600 hover:text-blue-600">
                        2
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-600 hover:text-blue-600">
                        3
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        aria-label="Next"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <i className="fa fa-angle-right" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;
