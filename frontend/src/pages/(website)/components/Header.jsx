import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaUser, FaUserPlus } from "react-icons/fa";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isLoggedIn = false;
  return (
    <header className="shadow-md bg-white">
      {/* Top Bar */}
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto px-6 flex justify-between text-sm text-gray-600">
          <p className="hidden lg:block">
            📍 Số 9, Trịnh Văn Bô, Nam Từ Liêm, Hà Nội
          </p>
          <p>📞 +084-123-4567 | 📩 nhom1@laptrinhweb.com</p>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div>
          <Link to="/">
            <img src="./src/img/logo.png" alt="Logo" className="w-32" />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-grow mx-4">
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="flex-grow bg-transparent outline-none px-2 text-sm"
            />
            <button className="text-gray-600 hover:text-blue-600">
              <FaSearch size={18} />
            </button>
          </div>
        </div>

        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <FaUser
            size={22}
            className="text-gray-600 hover:text-blue-600 transition duration-200"
          />

          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute right-0  w-56 bg-white shadow-lg rounded-lg overflow-hidden z-10 border border-gray-200"
            >
              <ul className="py-2 text-gray-700">
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link
                        to="/account"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-blue-500 hover:text-white transition"
                      >
                        <FaUser />
                        Tài khoản của tôi
                      </Link>
                    </li>
                    <li>
                      <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white transition">
                        <FaSignOutAlt />
                        Đăng xuất
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-blue-500 hover:text-white transition"
                      >
                        <FaSignInAlt />
                        Đăng nhập
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-green-500 hover:text-white transition"
                      >
                        <FaUserPlus />
                        Đăng ký
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </motion.div>
          )}
        </div>
        <Link
          to="/cart"
          className="relative text-gray-600 hover:text-blue-600 ml-3"
        >
          <FaShoppingCart size={20} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
            1
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="bg-blue-600">
        <div className="container mx-auto px-6">
          <ul className="flex space-x-6 text-white text-lg">
            <li>
              <Link to="/" className="py-4 inline-block text-white">
                Trang chủ
              </Link>
            </li>

            {/* Dropdown Mega Menu */}
            <li
              className="relative group py-4 cursor-pointer"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <Link to="/products" className="text-white">
                Sảm Phẩm
              </Link>

              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 top-full w-80 bg-white shadow-lg rounded-lg overflow-hidden z-10"
                >
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {[
                      { name: "Điện thoại", path: "/products/dienthoai" },
                      { name: "Phụ kiện", path: "/products/phukien" },
                      { name: "Ốp lưng", path: "/products/oplung" },
                    ].map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className="block p-3 rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white transition duration-200"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </li>

            <li>
              <Link to="/about" className="py-4 inline-block text-white">
                Thông tin
              </Link>
            </li>
            <li>
              <Link to="/blog" className="py-4 inline-block text-white">
                Bài viết
              </Link>
            </li>
            <li>
              <Link to="/contact" className="py-4 inline-block text-white">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
