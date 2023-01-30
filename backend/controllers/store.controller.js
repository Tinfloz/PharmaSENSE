import { multiIdValidator } from "../utils/multi.id.validator.js";
import Stores from "../models/store.model.js";
import Deliveries from "../models/deliveries.model.js";

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
        store.acceptRequests.push(delivery._id);
        await delivery.save();
        await store.save();
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

export {
    acceptRequest
}