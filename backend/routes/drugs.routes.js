import express from "express";
import { changeDosage, deleteMedication, getMyDrugs } from "../controllers/drugs.controller.js";
import { isPatient, protect } from "../middlewares/auth.middleware.js";

let router = express.Router();

router.route("/get/medicines").get(protect, isPatient, getMyDrugs);
router.route("/delete/medication/:id").get(protect, isPatient, deleteMedication);
router.route("/change/dosage/:id").post(protect, isPatient, changeDosage);

export default router;