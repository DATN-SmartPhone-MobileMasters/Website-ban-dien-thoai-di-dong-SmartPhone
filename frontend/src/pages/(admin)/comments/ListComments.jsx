import { message, Rate } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteComment,
  fetchComments,
  fetchUsers,
  replyComment,
} from "../../../service/api";

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

      // Cập nhật state comments trực tiếp với câu trả lời mới
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, Reply: response.data.data.Reply } // Giả sử backend trả về dữ liệu bình luận đã cập nhật
            : comment
        )
      );

      // Reset form
      setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
      setShowReplyForm((prev) => ({ ...prev, [commentId]: false }));

      // Thông báo cập nhật cho các giao diện khác (nếu cần)
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

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Danh Sách Bình Luận</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Database bình luận
          </h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Nội dung</th>
                  <th>Đánh giá</th>
                  <th>Ngày bình luận</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <React.Fragment key={comment._id}>
                    <tr>
                      <td>{comment.Email}</td>
                      <td className="text-truncate" style={{ maxWidth: "200px" }}>
                        {comment.NoiDung}
                      </td>
                      <td>
                        <Rate disabled defaultValue={parseInt(comment.DanhGia)} />
                      </td>
                      <td>{new Date(comment.NgayBL).toLocaleDateString()}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Link
                            to={`/admin/comments/${comment._id}`}
                            className="btn btn-info"
                            style={{ flex: "1", marginRight: "5px" }}
                          >
                            Xem
                          </Link>
                          <button
                            className="btn btn-danger"
                            style={{ flex: "1", marginRight: "5px" }}
                            onClick={() => handleDelete(comment._id)}
                          >
                            Xóa
                          </button>
                          <button
                            className="btn btn-primary"
                            style={{ flex: "1" }}
                            onClick={() => toggleReplyForm(comment._id)}
                          >
                            Trả lời
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Hiển thị câu trả lời của admin nếu có */}
                    {comment.Reply && (
                      <tr>
                        <td colSpan="5" style={{ backgroundColor: "#f5f5f5", padding: "10px" }}>
                          <div>
                            <strong style={{ color: "#1890ff" }}>
                              {comment.Reply.AdminEmail} (Admin)
                            </strong>
                            <span style={{ marginLeft: "10px", color: "#888" }}>
                              {new Date(comment.Reply.Date).toLocaleDateString()}
                            </span>
                            <p>{comment.Reply.Content}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                    {/* Form trả lời */}
                    {showReplyForm[comment._id] && (
                      <tr>
                        <td colSpan="5">
                          <div style={{ padding: "10px" }}>
                            <textarea
                              className="form-control"
                              placeholder="Nhập câu trả lời của bạn..."
                              value={replyContent[comment._id] || ""}
                              onChange={(e) =>
                                handleReplyChange(comment._id, e.target.value)
                              }
                            />
                            <button
                              className="btn btn-success mt-2"
                              onClick={() => handleReplySubmit(comment._id)}
                            >
                              Gửi
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminListComment;