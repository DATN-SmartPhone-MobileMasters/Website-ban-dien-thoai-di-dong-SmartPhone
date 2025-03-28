import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaUserPlus,
  FaBoxOpen,
} from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { updateUser, getUserById } from "../../../service/api";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Kiểm tra đăng nhập và lấy thông tin người dùng
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const storedUserData = localStorage.getItem("userData");

    if (authToken && storedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  // Lấy số lượng sản phẩm trong giỏ hàng khi component được tạo
  useEffect(() => {
    const updateCartCount = () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData?.id;

      if (userId) {
        const cartItems = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartCount(totalItems);
      }
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // Xử lý đăng xuất
  const handleLogout = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      await updateUser(userData.id, { TrangThai: 0 });
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserData(null);
    setCartCount(0);
    window.location.href = "/";
  };

  const checkUserExists = async (userId) => {
    try {
      const user = await getUserById(userId);
      return user.data;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const storedUserData = localStorage.getItem("userData");

    if (authToken && storedUserData) {
      setIsLoggedIn(true);
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);

      const interval = setInterval(async () => {
        const user = await checkUserExists(parsedUserData.id);
        if (!user) {
          handleAutoLogout();
        }
      }, 10000);

      return () => clearInterval(interval);
    }
  }, []);

  const handleAutoLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("cart");
    setIsLoggedIn(false);
    setUserData(null);
    setCartCount(0);
    window.location.href = "/login";
  };

  // Xử lý khi bấm vào giỏ hàng
  const handleCartClick = (e) => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      e.preventDefault();
      confirmAlert({
        title: "Yêu cầu đăng nhập",
        message: "Bạn cần đăng nhập để xem giỏ hàng.",
        buttons: [
          {
            label: "Đăng nhập",
            onClick: () => navigate("/login"),
          },
          {
            label: "Hủy",
            onClick: () => {},
          },
        ],
      });
    }
  };

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

        {/* User Dropdown */}
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-600 hover:text-blue-600 transition duration-200">
                {userData?.Email}
              </span>
            </div>
          ) : (
            <FaUser
              size={22}
              className="text-gray-600 hover:text-blue-600 transition duration-200"
            />
          )}

          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-10 border border-gray-200"
            >
              <ul className="py-2 text-gray-700 text-sm">
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link
                        to={`/account-details/${userData.id}`}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-blue-600 hover:text-white transition duration-200 whitespace-nowrap"
                      >
                        <FaUser className="flex-shrink-0" />
                        <span>Thông tin tài khoản</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/sanphamdamua`}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-purple-600 hover:text-white transition duration-200 whitespace-nowrap"
                      >
                        <FaBoxOpen className="flex-shrink-0" />
                        <span>Sản phẩm đã mua</span>
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white transition duration-200 whitespace-nowrap"
                      >
                        <FaSignOutAlt className="flex-shrink-0" />
                        <span>Đăng xuất</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-blue-500 hover:text-white transition whitespace-nowrap"
                      >
                        <FaSignInAlt className="flex-shrink-0" />
                        <span>Đăng nhập</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/signup"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-green-500 hover:text-white transition whitespace-nowrap"
                      >
                        <FaUserPlus className="flex-shrink-0" />
                        <span>Đăng ký</span>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Cart Icon */}
        <Link
          to="/cart"
          className="relative text-gray-600 hover:text-blue-600 ml-3"
          onClick={handleCartClick} // Hàm đã được định nghĩa ở trên
        >
          <FaShoppingCart size={20} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
            {cartCount}
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
            <li>
              <Link to="/products" className="py-4 inline-block text-white">
                Sản phẩm
              </Link>
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
              <Link to="/listdanhgiauser" className="py-4 inline-block text-white">
                Đánh giá
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