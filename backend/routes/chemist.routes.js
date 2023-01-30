import express from "express";
import { changeAddress, changeStoreName, createStore, deleteStore } from "../controllers/chemist.controller.js";
import { isChemist, protect } from "../middlewares/auth.middleware.js";

let router = express.Router();

router.route("/create/store").post(protect, isChemist, createStore);
router.route("/delete/store/:id").delete(protect, isChemist, deleteStore);
router.route("/change/name/:id").post(protect, isChemist, changeStoreName);
router.route("/change/address/:id").post(protect, isChemist, changeAddress);

export default router;