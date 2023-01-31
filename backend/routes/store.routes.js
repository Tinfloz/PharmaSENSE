import express from "express";
import { acceptRequest, getStoreDeliveries } from "../controllers/store.controller.js";
import { isChemist, protect } from "../middlewares/auth.middleware.js";

let router = express.Router();

router.route("/accept/request/:storeId/:deliveryId").get(protect, isChemist, acceptRequest);
router.route("/get/deliveries/:id").get(protect, isChemist, getStoreDeliveries);

export default router;