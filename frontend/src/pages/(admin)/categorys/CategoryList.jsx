import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteCategory, fetchCategories } from "../../../service/api";
import { Table, Button, Input, Space, Row, Col, Modal, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchCategories();
        setCategories(res.data.data);
      } catch (error) {
        message.error("Tải dữ liệu thất bại");
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa danh mục này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteCategory(id);
          setCategories(categories.filter((category) => category._id !== id));
          message.success("Xóa thành công");
        } catch (error) {
          message.error("Xóa thất bại");
        }
      },
    });
  };

  const filteredCategories = categories.filter((category) =>
    category.TenDM.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      title: "Tên danh mục",
      dataIndex: "TenDM",
      key: "TenDM",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/admin/categorys/update/${record._id}`}>
            <Button type="primary" icon={<EditOutlined />} />
          </Link>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: "24px" }}>Danh sách danh mục</h2>

      <Row justify="space-between" style={{ marginBottom: "16px" }}>
        <Col span={12}>
          <Input.Search
            placeholder="Tìm kiếm danh mục..."
            allowClear
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%" }}
          />
        </Col>
        <Col>
          <Link to="/admin/categorys/addcategory">
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm mới
            </Button>
          </Link>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredCategories}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: itemsPerPage,
          current: currentPage,
          total: filteredCategories.length,
          onChange: (page) => setCurrentPage(page),
          showSizeChanger: false,
        }}
        bordered
      />
    </div>
  );
};

export default CategoryList;
