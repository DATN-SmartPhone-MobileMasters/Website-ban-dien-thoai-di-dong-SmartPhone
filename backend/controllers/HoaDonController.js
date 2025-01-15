import HoaDon from "../models/HoaDon.js";

class HoaDonController {
  // API lấy danh sách hóa đơn
  static async apiList(req, res) {
    try {
      const hoaDons = await HoaDon.find();
      res.status(200).json({ success: true, data: hoaDons });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách hóa đơn", error });
    }
  }

  // API lấy chi tiết hóa đơn
  static async apiDetail(req, res) {
    const { id } = req.params;
    try {
      const hoaDon = await HoaDon.findById(id);
      if (!hoaDon) {
        return res.status(404).json({ success: false, message: "Hóa đơn không tồn tại" });
      }
      res.status(200).json({ success: true, data: hoaDon });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi khi lấy chi tiết hóa đơn", error });
    }
  }

  // API tạo hóa đơn mới
  static async apiCreate(req, res) {
    try {
      const newHoaDon = new HoaDon(req.body);
      await newHoaDon.save();
      res.status(201).json({ success: true, message: "Hóa đơn đã được tạo thành công", data: newHoaDon });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi khi tạo hóa đơn", error });
    }
  }

  // API cập nhật hóa đơn
  static async apiUpdate(req, res) {
    const { id } = req.params;
    try {
      const updatedHoaDon = await HoaDon.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedHoaDon) {
        return res.status(404).json({ success: false, message: "Hóa đơn không tồn tại" });
      }
      res.status(200).json({ success: true, message: "Hóa đơn đã được cập nhật", data: updatedHoaDon });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi khi cập nhật hóa đơn", error });
    }
  }

  // API xóa hóa đơn
  static async apiDelete(req, res) {
    const { id } = req.params;
    try {
      const deletedHoaDon = await HoaDon.findByIdAndDelete(id);
      if (!deletedHoaDon) {
        return res.status(404).json({ success: false, message: "Hóa đơn không tồn tại" });
      }
      res.status(200).json({ success: true, message: "Hóa đơn đã được xóa thành công" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi khi xóa hóa đơn", error });
    }
  }

  // API cập nhật hóa đơn (phương thức trùng tên)
  static async apiUpdate_hoadon(req, res) {
    const { id } = req.params;
    try {
      const updatedHoaDon = await HoaDon.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedHoaDon) {
        return res.status(404).json({ success: false, message: "Hóa đơn không tồn tại" });
      }
      res.status(200).json({ success: true, message: "Hóa đơn đã được cập nhật", data: updatedHoaDon });
    } catch (error) {
      res.status(500).json({ success: false, message: "Lỗi khi cập nhật hóa đơn", error });
    }
  }
}

export default HoaDonController;
