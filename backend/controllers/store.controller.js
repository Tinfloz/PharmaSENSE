import { multiIdValidator } from "../utils/multi.id.validator.js";
import Stores from "../models/store.model.js";
import Deliveries from "../models/deliveries.model.js";
import Orders from "../models/order.model.js";

// accept request
const acceptRequest = async (req, res) => {
    try {
        const { storeId, deliveryId } = req.params;
        if (multiIdValidator([storeId, deliveryId])) {
            throw "id invalid"
        };
        const store = await Stores.findById(storeId);
        const delivery = await Deliveries.findById(deliveryId);
        delivery.claimed = store._id;
        await delivery.save();
        res.status(200).json({
            success: true
        });
        return
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// get accepted deliveries
const getStoreDeliveries = async (req, res) => {
    try {
        const { id } = req.params;
        const store = await Stores.findById(id);
        if (!store) {
            throw "store not found";
        };
        const deliveries = await Deliveries.find({ claimed: store._id });
        res.status(200).json({
            success: true,
            deliveries
        });
        return
    } catch (error) {
        if (error === "store not found") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

export {
    acceptRequest,
    getStoreDeliveries
}