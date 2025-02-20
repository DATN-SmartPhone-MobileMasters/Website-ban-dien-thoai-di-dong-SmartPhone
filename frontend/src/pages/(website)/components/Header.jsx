import React from "react";

const Header = () => {
  return (
    <>
      <div>
        <div className="bg-gray-100 py-2">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="hidden lg:block">
                <p className="text-sm text-gray-500">Flexible Delivery, Fast Delivery.</p>
              </div>
              <div className="flex space-x-4 text-sm text-gray-500">
                <ul className="flex space-x-4">
                  <li>+084 123 4567</li>
                  <li>nhom21@laptrinhweb.com</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            {/* Logo */}
            <div className="w-1/4">
              <div className="logo">
                <a href="/">
                  <img src="./src/./img/logo.png" alt="MobileStore Logo" />
                </a>
              </div>
            </div>

            {/* Search Bar */}
            <div className="w-2/4">
              <div className="flex items-center bg-gray-100 p-2 rounded-lg">
                <input
                  type="text"
                  className="w-full p-2 rounded-l-lg border-none"
                  placeholder="Search Here"
                />
                <button
                  type="Submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
                >
                  <i className="fa fa-search" />
                </button>
              </div>
            </div>

            {/* Account and Cart */}
            <div className="w-1/4">
              <div className="flex items-center justify-end space-x-4">
                <ul className="flex items-center space-x-4 text-sm">
                  <li>
                    <a href="/account" className="hidden sm:block text-gray-600 hover:text-blue-500">
                      Tài khoản
                    </a>
                  </li>
                  <li>
                    <a href="/account/login" className="hidden sm:block text-gray-600 hover:text-blue-500">
                      Đăng nhập
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-500">
                      <i className="fa fa-heart" />
                    </a>
                  </li>
                  <li>
                    <a href="/cart" className="text-gray-600 hover:text-blue-500">
                      <i className="fa fa-shopping-cart" />{" "}
                      <sup className="text-xs text-red-500">1</sup>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-blue-500">
          <div className="container mx-auto px-4 py-2">
            <div className="text-center">
              <ul className="flex justify-center space-x-6 text-lg">
                <li className=" px-4 py-2 rounded">
                  <a href="/" className="text-white">Trang chủ</a>
                </li>
                <li className=" px-4 py-2 rounded">
                  <a href="/products"className="text-white">Điện thoại</a>
                </li>
                <li className=" px-4 py-2 rounded">
                  <a href="/about"className="text-white">Thông tin</a>
                </li>
                <li className=" px-4 py-2 rounded">
                  <a href="/blog"className="text-white">Bài viết</a>
                </li>
                <li className=" px-4 py-2 rounded">
                  <a href="/contact"className="text-white">Liên hệ, hỗ trợ</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
