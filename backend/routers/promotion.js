import express from "express";
import PromotionController from "../controllers/PromotionController.js";

const promotionController = new PromotionController();
const routePromotion = express.Router();

routePromotion.get("/", promotionController.getListPromotion);
routePromotion.get("/:id", promotionController.getDetailPromotion);
routePromotion.post("/", promotionController.createPromotion);
routePromotion.put("/:id", promotionController.updatePromotion);
routePromotion.delete("/:id", promotionController.deletePromotion);

export default routePromotion;
