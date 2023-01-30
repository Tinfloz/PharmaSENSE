import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        required: true
    },
    address: {
        type: String
    },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: {
            type: [Number],
            default: undefined,
            required: true
        },
    },
    drugs: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Drugs"
        }
    ],
}, { timestamps: true });

const Patients = mongoose.model("Patients", patientSchema);

export default Patients;

