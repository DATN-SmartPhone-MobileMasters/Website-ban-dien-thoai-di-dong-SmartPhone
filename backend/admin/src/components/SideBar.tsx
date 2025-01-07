import React from "react";

const SideBar = () => {
  return (
    <>
      {/* Sidebar */}
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        {/* Sidebar - Brand */}
        <a
          className="sidebar-brand d-flex align-items-center justify-content-center"
          href="/"
        >
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink" />
          </div>
          <div className="sidebar-brand-text mx-3">
            SP Admin <sup>2</sup>
          </div>
        </a>
        {/* Divider */}
        <hr className="sidebar-divider my-0" />
        {/* Nav Item - Trang chủ */}
        <li className="nav-item active">
          <a className="nav-link" href="/">
            <i className="fas fa-fw fa-tachometer-alt" />
            <span>Trang chủ</span>
          </a>
        </li>
        {/* Divider */}
        <hr className="sidebar-divider" />
        {/* Heading */}
        <div className="sidebar-heading">Chức năng</div>
        {/* Nav Item - Pages Collapse Menu */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseTwo"
            aria-expanded="true"
            aria-controls="collapseTwo"
          >
            <i className="fas fa-fw fa-cog" />
            <span>Quản lý danh mục</span>
          </a>
          <div
            id="collapseTwo"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <a className="collapse-item" href="#">
                Danh sách danh mục
              </a>
              <a className="collapse-item" href="#">
                Thêm mới danh mục
              </a>
            </div>
          </div>
        </li>
        {/* Nav Item - Utilities Collapse Menu */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseUtilities"
            aria-expanded="true"
            aria-controls="collapseUtilities"
          >
            <i className="fas fa-fw fa-wrench" />
            <span>Quản lý sản phẩm</span>
          </a>
          <div
            id="collapseUtilities"
            className="collapse"
            aria-labelledby="headingUtilities"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <a className="collapse-item" href="/products">
                Danh sách sản phẩm
              </a>
              <a className="collapse-item" href="#">
                Thêm mới sản phẩm
              </a>
            </div>
          </div>
        </li>
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseThuonghieu"
            aria-expanded="true"
            aria-controls="collapseThuonghieu"
          >
            <i className="fas fa-fw fa-wrench" />
            <span>Quản lý thương hiệu</span>
          </a>
          <div
            id="collapseThuonghieu"
            className="collapse"
            aria-labelledby="headingThuonghieu"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <a className="collapse-item" href="/brands">
                Danh sách thương hiệu
              </a>
              <a className="collapse-item" href="#">
                Thêm mới thương hiệu
              </a>
            </div>
          </div>
        </li>
        <li className="nav-item">
          <a className="nav-link collapsed" href="#">
            <i className="fas fa-fw fa-wrench" />
            <span>Quản lý đơn hàng</span>
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseVoucher"
            aria-expanded="true"
            aria-controls="collapseVoucher"
          >
            <i className="fas fa-fw fa-wrench" />
            <span>Quản lý voucher</span>
          </a>
          <div
            id="collapseVoucher"
            className="collapse"
            aria-labelledby="headingVoucher"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <a className="collapse-item" href="#">
                Danh sách voucher
              </a>
              <a className="collapse-item" href="#">
                Thêm mới voucher
              </a>
            </div>
          </div>
        </li>
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseBinhluan"
            aria-expanded="true"
            aria-controls="collapseBinhluan"
          >
            <i className="fas fa-fw fa-wrench" />
            <span>Quản lý bình luận</span>
          </a>
          <div
            id="collapseBinhluan"
            className="collapse"
            aria-labelledby="headingBinhluan"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <a className="collapse-item" href="#">
                Danh sách bình luận
              </a>
              <a className="collapse-item" href="#">
                Thêm mới bình luận
              </a>
            </div>
          </div>
        </li>
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseTaikhoan"
            aria-expanded="true"
            aria-controls="collapseTaikhoan"
          >
            <i className="fas fa-fw fa-wrench" />
            <span>Quản lý tài khoản</span>
          </a>
          <div
            id="collapseTaikhoan"
            className="collapse"
            aria-labelledby="headingTaikhoan"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <a className="collapse-item" href="#">
                Danh sách tài khoản
              </a>
              <a className="collapse-item" href="#">
                Thêm mới tài khoản
              </a>
            </div>
          </div>
        </li>
        {/* Sidebar Toggler (Sidebar) */}
        <div className="text-center d-none d-md-inline">
          <button className="rounded-circle border-0" id="sidebarToggle" />
        </div>
      </ul>
      {/* End of Sidebar */}
    </>
  );
};

export default SideBar;
