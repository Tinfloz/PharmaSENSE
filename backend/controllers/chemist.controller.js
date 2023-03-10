import mongoose from "mongoose";
import Chemists from "../models/chemist.model.js";
import Deliveries from "../models/deliveries.model.js";
import Orders from "../models/order.model.js";
import Patients from "../models/patient.model.js";
import Stores from "../models/store.model.js";

// create store
const createStore = async (req, res) => {
    try {
        const { name, address, longitude, latitude } = req.body;
        console.log(req.body);
        if (!name || !address) {
            throw "fields missing";
        };
        const chemist = await Chemists.findOne({ userId: req.user._id });
        let location = {
            type: "Point",
            coordinates: [longitude, latitude]
        };
        const store = await Stores.create({
            owner: chemist._id, name, address, location
        });
        chemist.stores.push(store._id);
        await chemist.save();
        res.status(200).json({
            success: true,
        });
        return
    } catch (error) {
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

// delete store
const deleteStore = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "invalid id"
        };
        const store = await Stores.findById(id);
        if (!store) {
            throw "store not found"
        };
        const chemist = await Chemists.findOne({ userId: req.user._id });
        if (store.owner.toString() !== chemist._id.toString()) {
            throw "not authorised";
        };
        for (let element of chemist.stores) {
            if (element.toString() === store._id.toString()) {
                let index = chemist.stores.indexOf(element);
                chemist.stores.splice(index, 1);
                break;
            };
        };
        await chemist.save();
        await store.remove();
        res.status(200).json({
            success: true,
            id
        });
        return
    } catch (error) {
        if (error === "store not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "not authorised") {
            res.status(403).json({
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

// change name 
const changeStoreName = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "invalid id"
        };
        const store = await Stores.findById(id);
        if (!store) {
            throw "store not found";
        };
        const chemist = await Chemists.findOne({ userId: req.user._id });
        const { name } = req.body;
        if (!name) {
            throw "fields missing";
        };
        if (store.owner.toString() !== chemist._id.toString()) {
            throw "not authorised";
        };
        store.name = name;
        await store.save();
        res.status(200).json({
            success: true,
            id, name
        });
        return
    } catch (error) {
        if (error === "fields missing") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "store not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "not authorised") {
            res.status(403).json({
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

// change address
const changeAddress = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "invalid id"
        };
        const store = await Stores.findById(id);
        if (!store) {
            throw "store not found";
        };
        const chemist = await Chemists.findOne({ userId: req.user._id });
        if (store.owner.toString() !== chemist._id.toString()) {
            throw "not authorised";
        };
        const { address, longitude, latitude } = req.body;
        let location = {
            type: "Point",
            coordinates: [longitude, latitude]
        };
        store.address = address || store.address;
        store.location = location;
        await store.save();
        res.status(200).json({
            success: true,
            address, latitude, longitude, id
        });
        return
    } catch (error) {
        if (error === "store not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "not authorised") {
            res.status(403).json({
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

// create order
const createOrder = async (req, res) => {
    try {
        const { name, patientId, deliveryId, total, tax } = req.body;
        if (!name || !patient || !total || !tax) {
            throw "missing fields";
        };
        const patient = await Patients.findById(patientId);
        const delivery = await Deliveries.findById(deliveryId);
        await Orders.create({
            name,
            patient: patient._id,
            total,
            tax,
            delivery: delivery._id,
            subTotal: (total + tax)
        });
        res.status(200).json({
            success: true
        });
        return
    } catch (error) {
        if (error === "missing fields") {
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

// get stores
const getStoresByChemistId = async (req, res) => {
    try {
        const chemist = await Chemists.findOne({
            userId: req.user._id
        });
        const stores = await Stores.find({ owner: chemist._id });
        res.status(200).json({
            stores
        });
        return
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

export {
    createStore,
    deleteStore,
    changeAddress,
    changeStoreName,
    createOrder,
    getStoresByChemistId
}