import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
    patient: {
        type: mongoose.Types.ObjectId,
        ref: "Patients"
    },
    drug: {
        type: mongoose.Types.ObjectId,
        ref: "Drugs"
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    }
}, { timestamps: true });

const Deliveries = mongoose.model("Deliveries", deliverySchema);

export default Deliveries;