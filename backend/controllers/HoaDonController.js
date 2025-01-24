import hoadon from "../models/HoaDon.js"; 

class HoaDonController {
  async apiList(req, res) {
    try {
      const hoaDons = await hoadon.find();
      res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: hoaDons,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy dữ liệu",
        error: error.message,
      });
    }
  }

  async apiDetail(req, res) {
    try {
      const id = req.params.id;
      const hoaDon = await hoadon.findById(id);
      if (!hoaDon) {
        return res.status(404).json({
          message: "Không tìm thấy hóa đơn",
        });
      }

      res.status(200).json({
        message: "Thành công",
        data: hoaDon,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy chi tiết",
        error: error.message,
      });
    }
  }
}

export default HoaDonController;
