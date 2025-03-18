import React from "react";
import { Link } from "react-router-dom";
import { updateUser } from '../../../service/api';
const SideBar = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const handleLogout = async () => {
      const authToken = localStorage.getItem("authToken");
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        await updateUser(userData.id, { TrangThai: 0 });
      }
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/admin/login'; 
    };
  return (
    <>
      {/* Sidebar */}
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        {/* Sidebar - Brand */}
        <Link
          className="sidebar-brand d-flex align-items-center justify-content-center"
          to="/admin/dashboard"
        >
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink" />
          </div>
          <div className="sidebar-brand-text mx-3">
            SP Admin <sup>2</sup>
          </div>
        </Link>
        {/* Admin Email */}
        <div className="sidebar-user px-3 py-2 text-center">
          <span className="text-white small">
            {userData?.Email}
          </span>
        </div>
        {/* Divider */}
        <hr className="sidebar-divider my-0" />
        {/* Nav Item - Trang chủ */}
        <li className="nav-item active">
          <Link className="nav-link" to="/admin/dashboard">
            <i className="fas fa-fw fa-tachometer-alt" />
            <span>Trang chủ</span>
          </Link>
        </li>
        {/* Divider */}
        <hr className="sidebar-divider" />
        {/* Heading */}
        <div className="sidebar-heading">Chức năng</div>
        {/* Quản lý danh mục */}
        <li className="nav-item">
          <Link
            className="nav-link collapsed"
            to="/admin/categorys"
            // data-toggle="collapse"
            // data-target="#collapseTwo"
            // aria-expanded="true"
            // aria-controls="collapseTwo"
          >
            <i className="fas fa-fw fa-cog" />
            <span>Quản lý danh mục</span>
          </Link>
          {/* <div
            id="collapseTwo"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link className="collapse-item" to="/categorys">
                Danh sách danh mục
              </Link>
              <Link className="collapse-item" to="/categorys/addcategory">
                Thêm mới danh mục
              </Link>
            </div>
          </div> */}
        </li>
        {/* Quản lý sản phẩm */}
        <li className="nav-item">
          <Link
            className="nav-link collapsed"
            to="/admin/products"
            // data-toggle="collapse"
            // data-target="#collapseUtilities"
            // aria-expanded="true"
            // aria-controls="collapseUtilities"
          >
            <i className="fas fa-fw fa-wrench" />
            <span>Quản lý sản phẩm</span>
          </Link>
          {/* <div
            id="collapseUtilities"
            className="collapse"
            aria-labelledby="headingUtilities"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link className="collapse-item" to="/products">
                Danh sách sản phẩm
              </Link>
              <Link className="collapse-item" to="/products/add">
                Thêm mới sản phẩm
              </Link>
            </div>
          </div> */}
        </li>
        {/* Quản lý thương hiệu */}
        <li className="nav-item">
          <Link
            className="nav-link collapsed"
            to="/admin/brands"
            // data-toggle="collapse"
            // data-target="#collapseThuonghieu"
            // aria-expanded="true"
            // aria-controls="collapseThuonghieu"
          >
            <i className="bi bi-slack"></i>
            <span>Quản lý thương hiệu</span>
          </Link>
          {/* <div
            id="collapseThuonghieu"
            className="collapse"
            aria-labelledby="headingThuonghieu"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link className="collapse-item" to="/brands">
                Danh sách thương hiệu
              </Link>

              <Link className="collapse-item" to="/brands/add">
                Thêm mới thương hiệu
              </Link>
            </div>
          </div> */}
        </li>
        {/* Quản lý hóa đơn */}
        <li className="nav-item">
          <Link className="nav-link" to="/admin/orders">
            <i className="bi bi-boxes"></i>
            <span>Quản lý hóa đơn</span>
          </Link>
        </li>
        {/* Quản lý voucher Admin */}
        <li className="nav-item">
          <Link
            to="/admin/vouchers"
            className="nav-link collapsed"
            // data-toggle="collapse"
            // data-target="#collapseVoucher"
            // aria-expanded="true"
            // aria-controls="collapseVoucher"
          >
            <i className="bi bi-ticket-perforated"></i>
            <span>Quản lý voucher</span>
          </Link>
          {/* <div
            id="collapseVoucher"
            className="collapse"
            aria-labelledby="headingVoucher"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link className="collapse-item" to="/vouchers">
                Danh sách voucher
              </Link>

              <Link className="collapse-item" to="/vouchers/add">
                Thêm mới voucher
              </Link>
            </div>
          </div> */}
        </li>

        <li className="nav-item">
          <Link
            className="nav-link collapsed"
            to="/danhgia"
          >
            <i className="fas fa-fw fa-comments" />
            <span>Quản lý đánh giá</span>
          </Link>
        </li>

        {/* Quản lý bình luận */}
        <li className="nav-item">
          <Link
            className="nav-link collapsed"
            to="/admin/comments"
          >
            <i className="fas fa-fw fa-comments" />
            <span>Quản lý bình luận</span>
          </Link>
        </li>
        {/* Quản lý tài khoản */}
        <li className="nav-item">
          <Link
            className="nav-link collapsed"
            to="/admin/accounts"
            // data-toggle="collapse"
            // data-target="#collapseTaikhoan"
            // aria-expanded="true"
            // aria-controls="collapseTaikhoan"
          >
            <i className="fas fa-fw fa-user" />
            <span>Quản lý tài khoản</span>
          </Link>
          {/* <div
            id="collapseTaikhoan"
            className="collapse"
            aria-labelledby="headingTaikhoan"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link className="collapse-item" to="/accounts">
                Danh sách tài khoản
              </Link>
            </div>
          </div> */}
        </li>
        {/* Sidebar Toggler */}
        <div className="text-center d-none d-md-inline">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white transition"
        >
          Đăng xuất
        </button>
        </div>
      </ul>
      {/* End of Sidebar */}
    </>
  );
};

export default SideBar;
