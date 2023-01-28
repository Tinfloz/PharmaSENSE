import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "Chemists"
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    type: { type: String, default: 'Point' },
    coordinates: {
        type: [Number],
        default: undefined,
        required: true
    },
    deliveryRequests: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Deliveries"
        }
    ],
    acceptRequests: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Deliveries"
        }
    ]
}, { timestamps: true });

const Stores = mongoose.model("Stores", storeSchema);

export default Stores;