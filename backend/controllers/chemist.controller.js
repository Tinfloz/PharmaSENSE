import mongoose from "mongoose";
import Chemists from "../models/chemist.model.js";
import Deliveries from "../models/deliveries.model.js";
import Stores from "../models/store.model.js";

// create store
const createStore = async (req, res) => {
    try {
        const { name, address, longitude, latitude } = req.body;
        if (!name || !address || !city || !state || !pincode) {
            throw "fields missing";
        };
        const chemist = await Chemists.findOne({ userId: req.user._id });
        let location = {
            type: { type: "Point" },
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
        if (store.owner.toString() !== chemist._id.toString) {
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
            type: { type: "Point" },
            coordinates: [longitude, latitude]
        };
        store.address = address || store.address;
        store.location = location;
        await store.save();
        res.status(400).json({
            success: true
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



export {
    createStore,
    deleteStore,
    changeAddress,
    changeStoreName,
}