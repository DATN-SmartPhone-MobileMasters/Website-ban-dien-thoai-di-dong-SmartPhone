import React from "react";

const Footer = () => {
  return (
    <>
      <div className="bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 p-4">
            {/* Thông tin hỗ trợ */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Thông tin hỗ trợ</h3>
              <div className="mb-4">
                <span className="text-blue-500">
                  <i className="fa fa-map-marker mr-2"></i>
                </span>
                Số 9, Trịnh Văn Bô, Nam Từ Liêm, Hà Nội
              </div>
              <div className="mb-4">
                <span className="text-blue-500">
                  <i className="fa fa-phone mr-2"></i>
                </span>
                +084-123-4567 / 89
              </div>
              <div>
                <span className="text-blue-500">
                  <i className="fa fa-envelope mr-2"></i>
                </span>
                nhom1@gmail.com
              </div>
            </div>

            {/* Tiện ích */}
            <div>
              <h3 className="text-lg font-semibold mb-4 ml-4">Tiện ích</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="index.html"
                    className="text-gray-600 hover:text-blue-500"
                  >
                    Trang chủ
                  </a>
                </li>
                <li>
                  <a
                    href="product-list.html"
                    className="text-gray-600 hover:text-blue-500"
                  >
                    Điện thoại
                  </a>
                </li>
                <li>
                  <a
                    href="about.html"
                    className="text-gray-600 hover:text-blue-500"
                  >
                    Thông tin
                  </a>
                </li>
                <li>
                  <a
                    href="blog-default.html"
                    className="text-gray-600 hover:text-blue-500"
                  >
                    Bài viết
                  </a>
                </li>
                <li>
                  <a
                    href="contact-us.html"
                    className="text-gray-600 hover:text-blue-500"
                  >
                    Liên hệ
                  </a>
                </li>
              </ul>
            </div>

            {/* Chính sách */}
            <div>
              <h3 className="text-lg font-semibold mb-4 ml-4">Chính sách</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-500">
                    Thanh toán
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-500">
                    Hủy, trả hàng
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-500">
                    Giao hàng và vận chuyển
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-500">
                    Chính sách bảo mật
                  </a>
                </li>
              </ul>
            </div>

            {/* Liên lạc với chúng tôi */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Liên lạc với chúng tôi
              </h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-blue-500">
                  <i className="fa fa-facebook text-2xl" />
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-500">
                  <i className="fa fa-twitter text-2xl" />
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-500">
                  <i className="fa fa-google-plus text-2xl" />
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-500">
                  <i className="fa fa-linkedin text-2xl"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-500">
                  <i className="fa fa-pinterest-p text-2xl"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-500">
                  <i className="fa fa-instagram text-2xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tiny Footer */}
        <div className="bg-gray-800 py-4 mt-12">
          <div className="container mx-auto text-center text-white">
            <div className="flex justify-center space-x-6 mb-4">
              <a href="#" className="text-white hover:text-yellow-400">
                <i className="fa fa-cc-paypal text-2xl"></i>
              </a>
              <a href="#" className="text-white hover:text-yellow-400">
                <i className="fa fa-cc-mastercard text-2xl"></i>
              </a>
              <a href="#" className="text-white hover:text-yellow-400">
                <i className="fa fa-cc-visa text-2xl"></i>
              </a>
              <a href="#" className="text-white hover:text-yellow-400">
                <i className="fa fa-cc-discover text-2xl"></i>
              </a>
            </div>
            <p className="text-sm">
              Copyright © All Rights Reserved 2025 by 
              <a
                href="#"
                target="_blank"
                className="text-yellow-500"
              >
                Nhom 1
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
