import express from "express";
import { getDeliveryById, getNearbyDeliveries } from "../controllers/deliveries.controller.js";
import { isChemist, protect } from "../middlewares/auth.middleware.js";

let router = express.Router();

router.route("/get/nearby/deliveries/:id").get(protect, isChemist, getNearbyDeliveries);
router.route("/get/delivery/:id").get(protect, isChemist, getDeliveryById);

export default router;