import express from "express";
import { changeAddress, changeStoreName, createOrder, createStore, deleteStore, getStoresByChemistId } from "../controllers/chemist.controller.js";
import { isChemist, protect } from "../middlewares/auth.middleware.js";

let router = express.Router();

router.route("/create/store").post(protect, isChemist, createStore);
router.route("/delete/store/:id").delete(protect, isChemist, deleteStore);
router.route("/change/name/:id").post(protect, isChemist, changeStoreName);
router.route("/change/address/:id").post(protect, isChemist, changeAddress);
router.route("/create/order").post(protect, isChemist, createOrder);
router.route("/get/stores").get(protect, isChemist, getStoresByChemistId);

export default router;