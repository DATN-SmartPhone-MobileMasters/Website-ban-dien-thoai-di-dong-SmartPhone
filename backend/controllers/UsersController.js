import Users from "../models/Users.js";

class UsersController {
  async userList(req, res) {
    try {
      const users = await Users.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async userDetail(req, res) {
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

  async userDelete(req, res) {
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

  async userCreate(req, res) {
    const user = new Users(req.body);
    try {
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async userUpdate(req, res) {
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

export default new UsersController();

