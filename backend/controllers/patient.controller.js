import Patients from "../models/patient.model.js";
import Drugs from "../models/drugs.model.js";
import Users from "../models/all.user.model.js";
import mongoose from "mongoose";
import { getCriticalLevel } from "../utils/get.critical.js";
import { getDaysUptoCriticalLevel } from "../utils/get.critical.day.js";
import Orders from "../models/order.model.js";
import razorpay from "razorpay";
import shortid from "shortid";
import Deliveries from "../models/deliveries.model.js";
import moment from "moment";
import nodeCron from "node-cron";

// create drugs 
const createMedications = async (req, res) => {
    try {
        const { name, dosage, volume, slots } = req.body;
        if (!name || !dosage || !volume || !slots) {
            throw "fields missing";
        };
        const patient = await Patients.findOne({ userId: req.user._id });
        const drug = await Drugs.create({
            patient: patient._id,
            drug: name,
            dosage,
            volume,
            slots,
            critical: getCriticalLevel(volume),
            remaining: volume,
            uptoCriticalLevelDays: getDaysUptoCriticalLevel(volume, dosage, getCriticalLevel(volume), slots.length)
        });
        if (!drug) {
            throw "could not be created";
        };
        patient.drugs.push(drug._id);
        await patient.save();
        res.status(200).json({
            success: true,
            drug
        });
        return
    } catch (error) {
        console.log(error)
        if (error === "fields missing") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

// get orders 
const getOrders = async (req, res) => {
    try {
        const patient = await Patients.findOne({
            userId: req.user._id
        });
        const orders = await Orders.find({
            patient: patient._id
        });
        res.status(200).json({
            success: true,
            orders
        });
        return
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// pay for order
const createRazorpayOrder = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "invalid id";
        };
        const order = await Orders.findById(id);
        if (!order) {
            throw "order not found"
        };
        const rzpInstance = new razorpay({
            key_id: process.env.RZP_KEY_ID,
            key_secret: process.env.RZP_KEY_SECRET
        });
        const options = {
            amount: (order.subTotal * 100),
            currency: "INR",
            receipt: shortid.generate()
        };
        let rzpOrder;
        try {
            rzpOrder = await rzpInstance.orders.create(options);
        } catch (error) {
            throw new Error("could not be created", { cause: error });
        };
        res.status(200).json({
            success: true,
            rzpOrder
        });
        return
    } catch (error) {
        if (error === "order not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

const verifyPayment = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id not valid"
        };
        const order = await Orders.findById(id);
        if (!order) {
            throw "order not found";
        };
        const delivery = await Deliveries.findById(order.delivery);
        if (!delivery) {
            throw "delivery not found";
        };
        const { orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature, } = req.body;
        if (!orderCreationId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
            throw "info missing"
        };
        let shasum = crypto.createHmac("sha256", process.env.RZP_KEY_SECRET);
        shasum.update(`${orderCreationId}|${razorpayPaymentId}`)
        let digest = shasum.digest("hex");
        if (digest !== razorpaySignature) {
            throw "payment not legit"
        };
        delivery.paid = true;
        order.paid = true;
        order.paidAt = moment(new Date(), "DD/MM/YYYY").format("DD/MM/YYYY");
        await delivery.save();
        await order.save();
        res.status(200).json({
            success: true
        });
        return
    } catch (error) {
        if (error === "order not found" || "delivery not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};


export {
    createMedications,
    getOrders,
    createRazorpayOrder,
    verifyPayment
}