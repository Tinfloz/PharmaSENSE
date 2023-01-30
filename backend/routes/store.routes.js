import express from "express";
import { acceptRequest } from "../controllers/store.controller.js";
import { isChemist, protect } from "../middlewares/auth.middleware.js";

let router = express.Router();

router.route("/accept/request/:storeId/:deliveryId").get(protect, isChemist, acceptRequest);

export default router;