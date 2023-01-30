import Stores from "../models/store.model.js";
import Deliveries from "../models/deliveries.model.js";

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
                    $geometry: { type: "Point", coordinates: [store.coordinates[0], store.coordinates[1]] },
                    $minDistance: 0,
                    $maxDistance: 7000
                }
            }
        }).populate("patient");
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

export {
    getNearbyDeliveries
}