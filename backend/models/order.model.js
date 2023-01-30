import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    patient: {
        type: mongoose.Types.ObjectId,
        ref: "Patients"
    },
    delivery: {
        type: mongoose.Types.ObjectId,
        ref: "Deliveries"
    },
    total: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    paid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: String,
    },
    subTotal: {
        type: Number,
        required: true
    },
    rzpOrderId: {
        type: String
    }
}, { timestamps: true });

const Orders = mongoose.model("Orders", orderSchema);
export default Orders;