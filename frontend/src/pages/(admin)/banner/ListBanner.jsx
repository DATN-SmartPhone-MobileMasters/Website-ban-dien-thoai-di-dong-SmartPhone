import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, message, Image, Popconfirm, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { deleteBanner, fetchBanners } from "../../../service/api";

const ListBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await fetchBanners();
      setBanners(res.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách banner:", error);
      message.error("Không thể tải danh sách banner!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await deleteBanner(id);
      if (response && response.status === 200) {
        setBanners(banners.filter((banner) => banner._id !== id));
        message.success("Xóa thành công!");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Xóa thất bại!");
      }
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
      width: 60,
    },
    {
      title: "Hình ảnh",
      dataIndex: "imgUrl",
      key: "imgUrl",
      render: (imgUrl) => (
        <Image
          src={imgUrl || "placeholder.jpg"}
          alt="banner"
          width={200}
          height={100}
          style={{ objectFit: "cover" }}
          placeholder
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (status ? "Bật" : "Tắt"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/banners/edit/${record._id}`}>
            <Button type="primary" icon={<EditOutlined />} size="small">
              Sửa
            </Button>
          </Link>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Danh sách banner</h2>
        <Link to="/admin/banners/add">
          <Button type="primary" icon={<PlusOutlined />} size="large">
            Thêm mới
          </Button>
        </Link>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={banners}
        loading={loading}
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "Không có dữ liệu để hiển thị." }}
      />
    </div>
  );
};

export default ListBanner;
