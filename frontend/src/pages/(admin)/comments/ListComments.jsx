import { message, Rate, Table, Button, Input, Typography, Space, Card } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteComment,
  fetchComments,
  fetchUsers,
  replyComment,
} from "../../../service/api";

const { Title, Text } = Typography;
const { TextArea } = Input;

const AdminListComment = () => {
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [replyContent, setReplyContent] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resComments = await fetchComments();
        setComments(resComments.data);

        const resUsers = await fetchUsers();
        setUsers(resUsers.data);
      } catch (error) {
        console.error(error);
        message.error("Lỗi khi lấy dữ liệu");
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bình luận này không?")) {
      try {
        await deleteComment(id);
        setComments(comments.filter((item) => item._id !== id));
        message.success("Đã xóa thành công");
      } catch (error) {
        console.error(error.message);
        message.error("Xóa thất bại");
      }
    }
  };

  const handleDeleteReply = async (commentId) => {
    if (window.confirm("Bạn có chắc muốn xóa câu trả lời này không?")) {
      try {
        const updatedComment = { ...comments.find(c => c._id === commentId), Reply: null };
        setComments(prevComments =>
          prevComments.map(comment =>
            comment._id === commentId ? updatedComment : comment
          )
        );
        message.success("Đã xóa câu trả lời thành công!");
        window.dispatchEvent(new Event("commentUpdated"));
      } catch (error) {
        console.error("Lỗi khi xóa câu trả lời:", error);
        message.error("Xóa câu trả lời thất bại!");
      }
    }
  };

  const toggleReplyForm = (commentId) => {
    setShowReplyForm((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReplyChange = (commentId, value) => {
    setReplyContent((prev) => ({
      ...prev,
      [commentId]: value,
    }));
  };

  const handleReplySubmit = async (commentId) => {
    if (!replyContent[commentId]) {
      message.error("Vui lòng nhập nội dung trả lời!");
      return;
    }

    try {
      const replyData = {
        Content: replyContent[commentId],
        Date: new Date().toISOString(),
        AdminEmail: "admin@example.com", // Thay bằng email admin thực tế từ localStorage/context
      };
      const response = await replyComment(commentId, replyData);
      message.success("Đã gửi câu trả lời thành công!");

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, Reply: response.data.data.Reply }
            : comment
        )
      );

      setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
      setShowReplyForm((prev) => ({ ...prev, [commentId]: false }));

      window.dispatchEvent(new Event("commentUpdated"));
    } catch (error) {
      console.error("Lỗi khi gửi câu trả lời:", error);
      if (error.response?.status === 404) {
        message.error("API trả lời bình luận chưa được triển khai!");
      } else {
        message.error("Gửi câu trả lời thất bại!");
      }
    }
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
      width: 200,
    },
    {
      title: "Nội dung",
      dataIndex: "NoiDung",
      key: "NoiDung",
      ellipsis: true, // Cắt ngắn nội dung nếu quá dài
    },
    {
      title: "Đánh giá",
      dataIndex: "DanhGia",
      key: "DanhGia",
      render: (text) => <Rate disabled value={parseInt(text)} />,
      width: 150,
    },
    {
      title: "Ngày bình luận",
      dataIndex: "NgayBL",
      key: "NgayBL",
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
      width: 150,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Link to={`/admin/comments/${record._id}`}>
            <Button type="primary" size="small">
              Xem
            </Button>
          </Link>
          <Button
            type="danger"
            size="small"
            onClick={() => handleDelete(record._id)}
          >
            Xóa
          </Button>
          <Button
            type="default"
            size="small"
            onClick={() => toggleReplyForm(record._id)}
          >
            Trả lời
          </Button>
        </Space>
      ),
      width: 200,
    },
  ];

  const expandedRowRender = (record) => (
    <Space direction="vertical" style={{ width: "100%", padding: "0 16px" }}>
      {record.Reply && (
        <Card
          size="small"
          style={{ backgroundColor: "#f5f5f5", borderRadius: "4px" }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space>
              <Text strong style={{ color: "#1890ff" }}>
                {record.Reply.AdminEmail} (Admin)
              </Text>
              <Text type="secondary">
                {new Date(record.Reply.Date).toLocaleDateString("vi-VN")}
              </Text>
            </Space>
            <Text>{record.Reply.Content}</Text>
          </Space>
        </Card>
      )}
      {showReplyForm[record._id] && (
        <Card size="small" style={{ borderRadius: "4px" }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <TextArea
              rows={3}
              placeholder="Nhập câu trả lời của bạn..."
              value={replyContent[record._id] || ""}
              onChange={(e) => handleReplyChange(record._id, e.target.value)}
            />
            <Button
              type="primary"
              onClick={() => handleReplySubmit(record._id)}
              style={{ marginTop: "8px" }}
            >
              Gửi
            </Button>
          </Space>
        </Card>
      )}
    </Space>
  );

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Title level={2} style={{ marginBottom: "24px" }}>
        Danh Sách Bình Luận
      </Title>
      <Card
        title={<Text strong style={{ color: "#1890ff" }}>Database bình luận</Text>}
        bordered={false}
        style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}
      >
        <Table
          columns={columns}
          dataSource={comments}
          rowKey="_id"
          expandable={{
            expandedRowRender,
            expandRowByClick: true, // Mở rộng khi nhấp vào hàng
          }}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }} // Hỗ trợ cuộn ngang nếu nội dung quá dài
        />
      </Card>
    </div>
  );
};

export default AdminListComment;