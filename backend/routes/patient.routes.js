import express from "express";
import { changeDosage, createMedications, deleteMedication } from "../controllers/patient.controller.js";
import { isPatient, protect } from "../middlewares/auth.middleware.js";

let router = express.Router();

router.route("/create/meds").post(protect, isPatient, createMedications);
router.route("/delete/medication").delete(protect, isPatient, deleteMedication);
router.route("/change/dosage/:id").post(protect, isPatient, changeDosage);

export default router;
