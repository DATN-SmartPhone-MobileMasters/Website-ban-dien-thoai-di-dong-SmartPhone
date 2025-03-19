import binhluan from "../models/Comment.js";

class CommentController {
  // Liệt kê tất cả bình luận
  async cmtList(req, res) {
    try {
      const comments = await binhluan.find();
      res.status(200).json(comments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  // theem bl
  async cmtCreate(req, res) {
    try {
      const data = req.body;
      const newComment = await binhluan.create(data);
      res.status(200).json({
        message: "Thêm bình luận thành công",
        data: newComment,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi thêm bình luận",
        error: error.message,
      });
    }
  }
  // Chi tiết bình luận
  async cmtDetail(req, res) {
    try {
      const comment = await binhluan.findById(req.params.id);
      if (!comment)
        return res.status(404).json({ message: "Không Lấy được dữ liệu" });

      res.status(200).json({ data: comment });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Xóa bình luận
  async cmtDelete(req, res) {
    try {
      const deletedComment = await binhluan.findByIdAndDelete(req.params.id);
      if (!deletedComment)
        return res.status(404).json({ message: "Không tìm thấy cmt " });

      res.status(200).json({ message: "Yeeee, xóa thành công dồi" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default CommentController;
