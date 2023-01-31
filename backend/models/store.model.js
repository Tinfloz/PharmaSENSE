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
    location: {
        type: { type: String, default: 'Point' },
        coordinates: {
            type: [Number],
            default: undefined,
            required: true
        },
    },
}, { timestamps: true });

const Stores = mongoose.model("Stores", storeSchema);

export default Stores;