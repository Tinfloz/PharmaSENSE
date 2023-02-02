import Stores from "../models/store.model.js";
import Deliveries from "../models/deliveries.model.js";
import mongoose from "mongoose";

// get nearby deliveries
const getNearbyDeliveries = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "invalid id";
        };
        const store = await Stores.findById(id);
        const deliveries = await Deliveries.find({
            location: {
                $near:
                {
                    $geometry: { type: "Point", coordinates: [store.location.coordinates[0], store.location.coordinates[1]] },
                    $minDistance: 0,
                    $maxDistance: 7000
                }
            }, claimed: undefined
        }).populate(['patient', 'drug']);
        res.status(200).json({
            deliveries
        });
        return
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

const getDeliveryById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id invalid";
        };
        const delivery = await Deliveries.findById(id);
        if (!delivery) {
            throw "delivery not found"
        };
        res.status(200).json({
            success: true,
            delivery,
        });
        return
    } catch (error) {
        if (error === "delivery not found") {
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
    getNearbyDeliveries,
    getDeliveryById
}