import Sanpham from "../models/SanPham.js";
import SanPham from "../models/SanPham.js";

//khởi tạo class sản phẩm 
class SanPhamController {
  //API functions
  async apiList(req, res) {
    try {
      const products = await SanPham.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  }

  async apiDetail(req, res) {
    const { id } = req.params; 

  try {
    const product = await Sanpham.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    return res.status(200).json({ data: product });
  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: 'Lỗi server, không thể lấy dữ liệu' });
  }
  }

  async apiDelete(req, res) {
    try {
      const { id } = req.params;
  
      const product = await SanPham.findByIdAndDelete(id);
  
      if (!product) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }
  
      res.status(200).json({ message: "Xóa sản phẩm thành công", product });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  }
  

  async apiCreate(req, res) {
    try {
      const addData = req.body;
      const product = await SanPham.create(addData); 
  
      res.status(201).json({ message: "Sản phẩm đã được tạo thành công", product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server", error });
    }
  }
  
  async apiUpdate(req, res) {
    try {
   
      const product = await SanPham.findByIdAndUpdate(req.params.id, req.body, { new: true });


      if (!product) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }
   
      res.status(200).json({ message: "Cập nhật sản phẩm thành công", product });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  }

  
}  


export default SanPhamController;
