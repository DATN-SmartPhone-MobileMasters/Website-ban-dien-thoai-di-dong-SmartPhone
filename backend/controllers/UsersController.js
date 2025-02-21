import Users from "../models/Users.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

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
        res.status(404).json({ message: "Không thấy tài khoản" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async apiDelete(req, res) {
    try {
      const user = await Users.findByIdAndDelete(req.params.id);
      if (user) {
        res.json({ message: "Xoá Thành Công" });
      } else {
        res.status(404).json({ message: "Không thấy tài khoản" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async apiSignUp(req, res) {
    try {
      const { error } = signUpSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const existingUser = await Users.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new Users({
        ...req.body,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();

      res.status(201).json({
        id: savedUser._id,
        email: savedUser.email,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async apiLogin(req, res) {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const user = await Users.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy tài khoản" });
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(401).json({ message: "Mật khẩu không chính xác" });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || "your_jwt_secret",
        { expiresIn: "1h" }
      );

      res.json({
        user: {
          id: user._id,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async apiUpdate(req, res) {
    try {
      const user = await Users.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "Không thấy tài khoản" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default UsersController;
