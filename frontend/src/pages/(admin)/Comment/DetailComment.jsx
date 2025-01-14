import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AdminDetailComment = () => {
  const { id } = useParams();
  const API_URL = `http://localhost:5000/cmt/comments/${id}`;

  const [comment, setComment] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(API_URL);
        setComment(response.data.data);
      } catch (error) {
        console.log(error);
        message.error("Lỗi khi lấy dữ liệu");
      }
    })();
  }, [id]);

  if (!comment) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Chi tiết bình luận</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Thông tin chi tiết
          </h6>
        </div>
        <div className="card-body">
          <div
            className="details-container"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div className="details-item" style={{ marginBottom: "10px" }}>
              <strong>Mã bình luận:</strong> {comment.MaBL}
            </div>
            <div className="details-item" style={{ marginBottom: "10px" }}>
              <strong>Mã người dùng:</strong> {comment.MaND}
            </div>
            <div className="details-item" style={{ marginBottom: "10px" }}>
              <strong>Mã sản phẩm:</strong> {comment.MaSP}
            </div>
            <div className="details-item" style={{ marginBottom: "10px" }}>
              <strong>Nội dung:</strong> {comment.NoiDung}
            </div>
            <div className="details-item" style={{ marginBottom: "10px" }}>
              <strong>Ngày bình luận:</strong> {comment.NgayBL}
            </div>
            <div className="details-item" style={{ marginBottom: "10px" }}>
              <strong>Hình ảnh sản phẩm:</strong>
              <br />
              <img
                src={comment.HinhAnhSP}
                alt="Hình ảnh sản phẩm"
                style={{ width: "100px", height: "100px", marginTop: "5px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailComment;
