import mongoose from "mongoose";

const drugSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Types.ObjectId,
        ref: "Patients"
    },
    drug: {
        type: String,
        required: true
    },
    dosage: {
        type: Number,
        required: true
    },
    remaining: {
        type: Number,
        required: true
    },
    volume: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Drugs = mongoose.model("Drugs", drugSchema);

export default Drugs;