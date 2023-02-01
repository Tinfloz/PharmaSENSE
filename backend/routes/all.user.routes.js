import express from "express";
import { login, register, reverseGeocodeFn, setAddress } from "../controllers/all.user.controllers.js";
import { isPatient, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/set/address").post(protect, isPatient, setAddress);
router.route("/reverse/geocode").get(protect, reverseGeocodeFn);

export default router;