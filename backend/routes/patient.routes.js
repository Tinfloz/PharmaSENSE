import express from "express";
import { createByScanning, createMedications, createRazorpayOrder, getOrders, verifyPayment } from "../controllers/patient.controller.js";
import { isPatient, protect } from "../middlewares/auth.middleware.js";

let router = express.Router();

router.route("/create/meds").post(protect, isPatient, createMedications);
router.route("/orders").get(protect, isPatient, getOrders);
router.route("/create/razorpay/order/:id").get(protect, isPatient, createRazorpayOrder);
router.route("/verify/payment/:id").post(protect, isPatient, verifyPayment);
router.route("/create/meds/photo").post(protect, isPatient, createByScanning);

export default router;
