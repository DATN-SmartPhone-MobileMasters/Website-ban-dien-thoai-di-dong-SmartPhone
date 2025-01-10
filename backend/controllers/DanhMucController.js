import Danhmuc from "../models/DanhMuc.js";
import Joi from "joi";

// Định nghĩa validation schema
const danhmucValidator = Joi.object({
  MaDM: Joi.string()
    .pattern(/^\d+$/) // Kiểm tra rằng MaDM là một chuỗi số
    .custom((value, helper) => {
      if (parseInt(value) < 0) {
        return helper.message("Mã danh mục không được là số âm");
      }
      return value;
    })
    .required(),
  TenDM: Joi.string().required(),
});

// Lấy danh sách danh mục
export const apiList = async (req, res) => {
  try {
    const danhmucs = await Danhmuc.find();
    res.status(200).json({
      message: "Lấy dữ liệu thành công",
      data: danhmucs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy dữ liệu",
      error: error.message,
    });
  }
};

// Lấy chi tiết danh mục
export const apiDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const danhmuc = await Danhmuc.findById(id);

    if (!danhmuc) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }

    res.status(200).json({
      message: "Thành công",
      data: danhmuc,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy chi tiết danh mục",
      error: error.message,
    });
  }
};

// Xóa danh mục
export const apiDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedDanhmuc = await Danhmuc.findByIdAndDelete(id);

    if (!deletedDanhmuc) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }

    res.status(200).json({
      message: "Xóa thành công",
      data: deletedDanhmuc,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa danh mục",
      error: error.message,
    });
  }
};

// Tạo danh mục mới
export const apiCreate = async (req, res) => {
  try {
    const { error } = danhmucValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const listErrors = error.details.map((item) => item.message);
      return res.status(400).json({ message: listErrors });
    }

    const data = req.body;
    const newDanhmuc = await Danhmuc.create(data);

    res.status(201).json({
      message: "Tạo danh mục thành công",
      data: newDanhmuc,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo danh mục",
      error: error.message,
    });
  }
};

// Cập nhật danh mục
export const apiUpdate = async (req, res) => {
  try {
    const { error } = danhmucValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const listErrors = error.details.map((item) => item.message);
      return res.status(400).json({ message: listErrors });
    }

    const id = req.params.id;
    const data = req.body;
    const updatedDanhmuc = await Danhmuc.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedDanhmuc) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }

    res.status(200).json({
      message: "Cập nhật danh mục thành công",
      data: updatedDanhmuc,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật danh mục",
      error: error.message,
    });
  }
};
