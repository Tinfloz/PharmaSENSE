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
import puppeteer from "puppeteer";
import jimp from "jimp";
import jsqr from "jsqr";
import tesseract from "tesseract.js";

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

const createByScanning = async (req, res) => {
    try {
        const { photo, dosage, slots } = req.body;
        if (!photo || !volume || !dosage || !slots) {
            throw "empty fields";
        };
        const patient = await Patients.findOne({
            userId: req.user._id
        });
        const photoBuffer = Buffer.from(photo.split(",")[1], "base64");
        // const volumeBuffer = Buffer.from(volume.split(",")[1], "base64");
        const image = await jimp.read(photoBuffer);
        const qrCodeImageArray = new Uint8ClampedArray(image.bitmap.data.buffer);
        const code = jsqr(
            qrCodeImageArray,
            image.bitmap.width,
            image.bitmap.height
        );
        const toPage = code.data;
        let screenshot = await (async () => {
            const browser = await puppeteer.launch({
                defaultViewport: {
                    width: 1280,
                    height: 2000,
                },
            });
            const page = await browser.newPage();
            await page.goto(toPage);
            let screenshot = `data:image/png;base64,${await page.screenshot({ encoding: "base64" })}`;
            return screenshot;
        })()
        console.log(screenshot);
        const bufferImage = Buffer.from(screenshot.split(",")[1], "base64");
        const data = await tesseract.recognize(bufferImage, "eng");
        const dataArray = data.data.text.split(" ");
        const regExp = new RegExp("^\\d+$");
        const numberDataArray = dataArray.filter(el => regExp.test(el)).sort();
        const idxName = dataArray.indexOf("Name");
        const volume = numberDataArray[numberDataArray.length - 1]
        const nameOfMed = dataArray[idxName + 1];
        const drug = await Drugs.create({
            patient: patient._id,
            drug: nameOfMed,
            dosage,
            volume,
            slots,
            critical: getCriticalLevel(volume),
            remaining: volume,
            uptoCriticalLevelDays: getDaysUptoCriticalLevel(volume, dosage, getCriticalLevel(volume), slots.length)
        });
        res.status(200).json({
            success: true,
            drug
        });
        return
    } catch (error) {
        if (error === "empty fields") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        }
    }
}

export {
    createMedications,
    getOrders,
    createRazorpayOrder,
    verifyPayment,
    createByScanning
}