import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
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
          to="/"
        >
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink" />
          </div>
          <div className="sidebar-brand-text mx-3">
            SP Admin <sup>2</sup>
          </div>
        </Link>
        {/* Divider */}
        <hr className="sidebar-divider my-0" />
        {/* Nav Item - Trang chủ */}
        <li className="nav-item active">
          <Link className="nav-link" to="/">
            <i className="fas fa-fw fa-tachometer-alt" />
            <span>Trang chủ</span>
          </Link>
        </li>
        {/* Divider */}
        <hr className="sidebar-divider" />
        {/* Heading */}
        <div className="sidebar-heading">Chức năng</div>
        {/* Nav Item - Pages Collapse Menu */}
        <li className="nav-item">
          <Link
            className="nav-link collapsed"
            to="#"
            data-toggle="collapse"
            data-target="#collapseTwo"
            aria-expanded="true"
            aria-controls="collapseTwo"
          >
            <i className="fas fa-fw fa-cog" />
            <span>Quản lý danh mục</span>
          </Link>
          <div
            id="collapseTwo"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link className="collapse-item" to="/categorys">
                Danh sách danh mục
              </Link>
              <Link className="collapse-item" to="categorys/addcategory">
                Thêm mới danh mục
              </Link>
            </div>
          </div>
        </li>
        {/* Nav Item - Utilities Collapse Menu */}
        <li className="nav-item">
          <Link
            className="nav-link collapsed"
            to="#"
            data-toggle="collapse"
            data-target="#collapseUtilities"
            aria-expanded="true"
            aria-controls="collapseUtilities"
          >
            <i className="fas fa-fw fa-wrench" />
            <span>Quản lý sản phẩm</span>
          </Link>
          <div
            id="collapseUtilities"
            className="collapse"
            aria-labelledby="headingUtilities"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link className="collapse-item" to="/ProductsList">
                Danh sách sản phẩm
              </Link>
              <Link className="collapse-item" to="/ProductsAdd">
                Thêm mới sản phẩm
              </Link>

              <Link className="collapse-item" to="#">
                Danh sách sản phẩm
              </Link>
              <Link className="collapse-item" to="categorys/addcategory">
                Thêm mới sản phẩm
              </Link>
            </div>
          </div>
        </li>
        {/* Nav Item - Quản lý thương hiệu */}
        <li className="nav-item">
          <Link
            className="nav-link collapsed"
            to="#"
            data-toggle="collapse"
            data-target="#collapseThuonghieu"
            aria-expanded="true"
            aria-controls="collapseThuonghieu"
          >
            <i className="fas fa-fw fa-wrench" />
            <span>Quản lý thương hiệu</span>
          </Link>
          <div
            id="collapseThuonghieu"
            className="collapse"
            aria-labelledby="headingThuonghieu"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link className="collapse-item" to="#">
              <Link className="collapse-item" to="/brands">
                Danh sách thương hiệu
              </Link>
              <Link className="collapse-item" to="#">
                Thêm mới thương hiệu
              </Link>
            </div>
          </div>
        </li>
        {/* Other Items */}
        <li className="nav-item">
          <Link className="nav-link collapsed" to="#">
            <i className="fas fa-fw fa-wrench" />
            <span>Quản lý đơn hàng</span>
          </Link>
        </li>
        {/* Nav Item - Quản lý voucher */}
        <li className="nav-item">
          <Link
            className="nav-link collapsed"
            to="#"
            data-toggle="collapse"
            data-target="#collapseVoucher"
            aria-expanded="true"
            aria-controls="collapseVoucher"
          >
            <i className="fas fa-fw fa-wrench" />
            <span>Quản lý voucher</span>
          </Link>
          <div
            id="collapseVoucher"
            className="collapse"
            aria-labelledby="headingVoucher"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link className="collapse-item" to="#">
                Danh sách voucher
              </Link>
              <Link className="collapse-item" to="#">
                Thêm mới voucher
              </Link>
            </div>
          </div>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link collapsed"
            to="#"
            data-toggle="collapse"
            data-target="#collapseBinhluan"
            aria-expanded="true"
            aria-controls="collapseBinhluan"
          >
            <i className="fas fa-fw fa-wrench" />
            <span>Quản lý bình luận</span>
          </Link>
          <div
            id="collapseBinhluan"
            className="collapse"
            aria-labelledby="headingBinhluan"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">

=======

              <Link className="collapse-item" to="#">

              <Link className="collapse-item" to="/comments">


                Danh sách bình luận
              </Link>
            </div>
          </div>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link collapsed"
            to="#"
            data-toggle="collapse"
            data-target="#collapseTaikhoan"
            aria-expanded="true"
            aria-controls="collapseTaikhoan"
          >

            <i className="fas fa-fw fa-user" />

            <span>Quản lý tài khoản</span>
          </Link>
          <div
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
          </div>
        </li>

        {/* Sidebar Toggler */}
        <div className="text-center d-none d-md-inline">
          <button className="rounded-circle border-0" id="sidebarToggle" />
        </div>
      </ul>
      {/* End of Sidebar */}
    </>
  );
};

export default SideBar;
