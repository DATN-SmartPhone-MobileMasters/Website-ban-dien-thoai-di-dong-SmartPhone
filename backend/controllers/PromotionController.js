import Promotion from "../models/Promotion.js";
import { promotionValidator } from "../validations/promotion.js";

class PromotionController {
  async getListPromotion(req, res) {
    try {
      const promotions = await Promotion.find();
      res.status(200).json({
        message: "Data retrieved successfully",
        data: promotions,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getDetailPromotion(req, res) {
    try {
      const promotion = await Promotion.findById(req.params.id);
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      res.status(200).json({
        message: "Data retrieved successfully",
        data: promotion,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createPromotion(req, res) {
    try {
      const { error } = promotionValidator.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const listErr = error.details.map((err) => err.message);
        return res.status(400).json({ message: listErr });
      }
      const promotion = await Promotion.create(req.body);
      res.status(201).json({
        message: "Data created successfully",
        data: promotion,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deletePromotion(req, res) {
    try {
      const promotion = await Promotion.findByIdAndDelete(req.params.id);
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      res.status(200).json({
        message: "Data deleted successfully",
        data: promotion,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updatePromotion(req, res) {
    try {
      const { error, value } = promotionValidator.validate(req.body);
      if (error) {
        const listErr = error.details.map((err) => err.message);
        return res.status(400).json({ message: listErr });
      }

      const promotion = await Promotion.findByIdAndUpdate(
        req.params.id,
        value,
        { new: true }
      );
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }

      res.status(200).json({
        message: "Data updated successfully",
        data: promotion,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default PromotionController;
