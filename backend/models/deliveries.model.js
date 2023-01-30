import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
    patient: {
        type: mongoose.Types.ObjectId,
        ref: "Patients"
    },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: {
            type: [Number],
            default: undefined,
            required: true
        }
    },
    drug: {
        type: mongoose.Types.ObjectId,
        ref: "Drugs"
    },
    claimed: {
        type: mongoose.Types.ObjectId,
        ref: "Stores",
        default: undefined
    },
    paid: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Deliveries = mongoose.model("Deliveries", deliverySchema);

export default Deliveries;