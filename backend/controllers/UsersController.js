import Users from "../models/Users.js";
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

class UsersController {
  async apiList(req, res) {
    try {
      const users = await Users.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async apiDetail(req, res) {
    try {
      const user = await Users.findById(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'Không thấy tài khoản' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async apiDelete(req, res) {
    try {
      const user = await Users.findByIdAndDelete(req.params.id);
      if (user) {
        res.json({ message: 'Xoá Thành Công' });
      } else {
        res.status(404).json({ message: 'Không thấy tài khoản' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async apiSignUp(req, res) {
    const signUpSchema = Joi.object({
      HoVaTen: Joi.string().required(), 
      SDT: Joi.string().required(), 
      Email: Joi.string().email().required(), 
      MatKhau: Joi.string().min(6).required(), 
      confirmPassword:  Joi.string().min(6).required(),
    }).options({ abortEarly: false });
    try {
      const { error } = signUpSchema.validate(req.body, { abortEarly: false });
      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: errorMessages });
      }
      if (req.body.confirmPassword !== req.body.MatKhau) {
        return res.status(400).json({ message: 'Mật khẩu và xác nhận mật khẩu không khớp' });
      }
      const existingUser = await Users.findOne({ Email: req.body.Email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email đã tồn tại' });
      }

      const hashedPassword = await bcrypt.hash(req.body.MatKhau, 10);
      const newUser = new Users({
        MaND: new mongoose.Types.ObjectId().toString(),
        HoVaTen: req.body.HoVaTen,
        GioiTinh:'Nam',
        SDT: req.body.SDT,
        Email: req.body.Email,
        DiaChi:'',
        TaiKhoan:'',
        MatKhau: hashedPassword, 
        MaQuyen: 0,
        TrangThai: 1 
      });
  
      // Save the user to the database
      const savedUser = await newUser.save();
  
      // Return success response
      res.status(201).json({
        id: savedUser._id,
        Email: savedUser.Email
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
  async apiLogin(req, res) {
    const loginSchema = Joi.object({
      Email: Joi.string().required(),
      MatKhau: Joi.string().required()
    }).options({ abortEarly: false });
    
    try {
      const { error } = loginSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const user = await Users.findOne({ Email: req.body.Email });
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
      }

      const validPassword = await bcrypt.compare(req.body.MatKhau, user.MatKhau);
      if (!validPassword) {
        return res.status(401).json({ message: 'Mật khẩu không chính xác' });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        user: {
          id: user._id,
          Email: user.Email
        },
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async apiUpdate(req, res) {
    try {
      const user = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'Không thấy tài khoản' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default UsersController;